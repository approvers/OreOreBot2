import { diffLines } from 'diff';
import type { MessageUpdateEventResponder } from '../runner';

/**
 * 監視するメッセージの抽象。
 *
 * @export
 * @interface Observable
 */
export interface EditingObservable {
  /**
   * メッセージの文章。
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
  implements MessageUpdateEventResponder<EditingObservable>
{
  async on(
    _event: 'UPDATE',
    before: EditingObservable,
    after: EditingObservable
  ): Promise<void> {
    const composed = diffComposer(before.content, after.content);
    if (composed === '') {
      return;
    }
    await after.sendToSameChannel(`見てたぞ
\`\`\`diff
${composed}
\`\`\``);
  }
}
