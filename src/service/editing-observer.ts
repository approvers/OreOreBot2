import { diffLines } from 'diff';
import type { MessageEvent, MessageEventResponder } from '../runner';

/**
 * 監視するメッセージの抽象。
 *
 * @export
 * @interface Observable
 */
export interface EditingObservable {
  /**
   * メッセージの編集前の文章。
   *
   * @type {string}
   * @memberof Observable
   */
  readonly before: string;
  /**
   * メッセージの編集後の文章。
   *
   * @type {string}
   * @memberof Observable
   */
  readonly after: string;

  /**
   * `message` のメッセージをこのメッセージと同じチャンネルに送信する。
   *
   * @param {string} message
   * @returns {Promise}
   * @memberof Observable
   */
  sendToSameChannel(message: string): Promise<void>;
}

const diffComposer = (before: string, after: string): string => {
  const changes = diffLines(before, after);
  let composed = '';
  for (const { value, added, removed } of changes) {
    if (composed !== '') {
      composed += '---------------------------------\n';
    }
    if (removed) {
      composed += `- ${value}`;
    }
    if (added) {
      composed += `+ ${value}`;
    }
  }
  return composed;
};

export class EditingObserver
  implements MessageEventResponder<EditingObservable>
{
  async on(event: MessageEvent, message: EditingObservable): Promise<void> {
    if (event !== 'UPDATE') {
      return;
    }
    const { before, after } = message;
    const composed = diffComposer(before, after);
    if (composed === '') {
      return;
    }
    await message.sendToSameChannel(`見てたぞ
\`\`\`diff
${composed}
\`\`\``);
  }
}
