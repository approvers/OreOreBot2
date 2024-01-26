import type { MessageEvent, MessageEventResponder } from '../runner/index.js';

/**
 * 監視するメッセージの抽象。
 */
export interface DeletionObservable {
  /**
   * メッセージの作成者。
   */
  readonly author: string;
  /**
   * メッセージの内容
   */
  readonly content: string;

  /**
   * メッセージの送信日時
   */
  readonly createdAt: Date;

  /**
   * すぐ消えてしまう `message` のメッセージをこのメッセージと同じチャンネルに送信する。
   *
   * @param message - 送信するメッセージのテキスト
   * @returns 送信に成功すると解決される `Promise`
   */
  sendEphemeralToSameChannel(message: string): Promise<void>;
}

/**
 * メッセージの削除を検知して、その内容と作者を復唱する。
 *
 * @typeParam M - `DeletionObservable` を満たした、監視するメッセージの型
 */
export class DeletionRepeater<M extends DeletionObservable>
  implements MessageEventResponder<M>
{
  /**
   * メッセージを無視するかどうかを判定する述語。
   * この述語がtrueを返した場合、内容を復唱しない。
   */
  constructor(private readonly isIgnoreTarget: (content: string) => boolean) {}

  async on(event: MessageEvent, message: M): Promise<void> {
    if (event !== 'DELETE') {
      return;
    }
    const { author, content, createdAt } = message;
    if (this.isIgnoreTarget(content)) {
      return;
    }

    const now = new Date();
    const diff = now.getTime() - createdAt.getTime();
    if (diff <= 3) {
      await message.sendEphemeralToSameChannel(`${author}さんの恐ろしく早いメッセージの削除。私じゃなきゃ見逃していましたよ。
      \`\`\`
      ${content}
      \`\`\``);
      return;
    }

    await message.sendEphemeralToSameChannel(`${author}さん、メッセージを削除しましたね？私は見ていましたよ。内容も知っています。
\`\`\`
${content}
\`\`\``);
  }
}
