import diff from 'fast-diff';

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
  let composed = '';
  const beforeLines: (string | undefined)[] = before.split('\n');
  const afterLines: (string | undefined)[] = after.split('\n');
  for (let i = 0; i < Math.max(beforeLines.length, afterLines.length); ++i) {
    if (i != 0) {
      composed += '\n';
    }
    const changes = diff(beforeLines[i] ?? '', afterLines[i] ?? '');
    for (const [type, diff] of changes) {
      switch (type) {
        case -1:
          composed += `~~${diff}~~`;
          break;
        case 0:
          composed += diff;
          break;
        case 1:
          composed += `*${diff}*`;
          break;
      }
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
    await after.sendEphemeralToSameChannel(
      `見てたぞ\n${composed}`.replaceAll('\n', '\n> ')
    );
  }
}
