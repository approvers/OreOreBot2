import { Differ } from 'difflib-ts';

import type { MessageUpdateEventResponder } from '../runner/index.js';

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
   * すぐ消えてしまう `message` のメッセージをこのメッセージと同じチャンネルに送信する。
   *
   * @param {string} message
   * @returns {Promise}
   * @memberof Observable
   */
  sendEphemeralToSameChannel(message: string): Promise<void>;
}

const diffComposer = (before: string, after: string): string => {
  const differ = new Differ();
  const changes = differ.compare(before.split('\n'), after.split('\n'));
  let composed = '';
  for (const change of changes) {
    if (change.startsWith('-')) {
      if (composed !== '') {
        composed += '---------------------------------\n';
      }
      composed += `${change.trimEnd()}\n`;
    }
    if (change.startsWith('+')) {
      composed += `${change.trimEnd()}\n`;
    }
  }
  return composed;
};

export class DifferenceDetector
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
    await after.sendEphemeralToSameChannel(`見てたぞ
\`\`\`diff
${composed}\`\`\``);
  }
}
