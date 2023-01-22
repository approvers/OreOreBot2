import { describe, expect, it } from 'vitest';

import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';
import { createMockMessage } from '../../command-message.js';
import { Meme } from '../../meme.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of nine', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['nine', '限界開発鯖', 'オタク'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: `限界開発鯖はオタクが9割`
          });
        }
      )
    );
  });

  it('args null (nine)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['nine'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: '人は引数ミスが9割',
            title: '引数が不足してるみたいだ。'
          });
        }
      )
    );
  });
});
