import type { MessageEvent, MessageEventResponder } from '../runner/index.js';

/**
 * 監視するメッセージの抽象。
 *
 * @export
 * @interface Observable
 */
export interface DeletionObservable {
  /**
   * メッセージの作成者。
   *
   * @type {string}
   * @memberof Observable
   */
  readonly author: string;
  /**
   * メッセージの内容
   *
   * @type {string}
   * @memberof Observable
   */
  readonly content: string;

  /**
   * `message` のメッセージをこのメッセージと同じチャンネルに送信する。
   *
   * @param {string} message
   * @returns {Promise}
   * @memberof Observable
   */
  sendToSameChannel(message: string): Promise<void>;
}

/**
 * メッセージの削除を検知して、その内容と作者を復唱する。
 *
 * @export
 * @class DeletionRepeater
 * @implements {MessageEventResponder<M>}
 * @template M
 */
export class DeletionRepeater<M extends DeletionObservable>
  implements MessageEventResponder<M>
{
  async on(event: MessageEvent, message: M): Promise<void> {
    if (event !== 'DELETE') {
      return;
    }
    const { author, content } = message;
    await message.sendToSameChannel(`${author}さん、メッセージを削除しましたね？私は見ていましたよ。内容も知っています。
\`\`\`
${content}
\`\`\``);
  }
}
