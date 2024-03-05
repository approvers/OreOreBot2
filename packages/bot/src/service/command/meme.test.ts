import { describe, expect, it, mock } from 'bun:test';

import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';
import { createMockMessage } from './command-message.js';
import { Meme } from './meme.js';

describe('meme', () => {
  const responder = new Meme();

  /**
   * 各Memeのテストケースは src/service/command/meme/test に移動しています。
   * https://github.com/approvers/OreOreBot2/pull/600
   */

  it('report error only once', async () => {
    const fn = mock();
    await responder.on(
      createMockMessage(parseStringsOrThrow(['hukueki'], responder.schema), fn)
    );
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({
      title: '引数が不足してるみたいだ。',
      description: '服役できなかった。'
    });
  });
});
