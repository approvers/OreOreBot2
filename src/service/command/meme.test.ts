import { Meme, sanitizeArgs } from './meme.js';
import { describe, expect, it, vi } from 'vitest';

import { createMockMessage } from './command-message.js';
import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';

describe('meme', () => {
  const responder = new Meme();

  /**
   * 各Memeのテストケースは /src/service/command/meme/test に移動しています。
   * https://github.com/approvers/OreOreBot2/pull/600
   */

  it('delete message', async () => {
    const fn = vi.fn();
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['fukueki', 'こるく'], responder.schema),
        fn
      )
    );
    expect(fn).not.toHaveBeenCalled();
  });
});

describe('sanitizeArgs', () => {
  it('rids pollution', () => {
    expect(
      sanitizeArgs(['--yes', '--__proto__=0', '-n', '-constructor', 'hoge'])
    ).toStrictEqual(['--yes', '-n', 'hoge']);
  });
});
