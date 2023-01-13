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

const processLine = (diff: string): [string, string, string] => {
  if (diff.startsWith('\n')) {
    return ['\n', diff.slice(1), ''];
  }
  const trailingLinePos = diff.lastIndexOf('\n');
  if (trailingLinePos === -1) {
    return ['', diff, ''];
  }
  return ['', diff.slice(0, trailingLinePos), diff.slice(trailingLinePos)];
};

const diffComposer = (before: string, after: string): string => {
  const changes = diff(before, after);
  let composed = '';
  for (const [type, diff] of changes) {
    const [start, body, end] = processLine(diff);
    switch (type) {
      case -1:
        composed += `${start}~~${body}~~${end}`;
        break;
      case 0:
        composed += diff;
        break;
      case 1:
        composed += `${start}*${body}*${end}`;
        break;
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
