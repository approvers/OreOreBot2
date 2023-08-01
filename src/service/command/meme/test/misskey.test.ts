import { describe, expect, it } from 'vitest';

import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';
import { createMockMessage } from '../../command-message.js';
import { Meme } from '../../meme.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of misskey', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['misskey', 'Go', 'Google'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: `GoはGoogle製なので将来性が心配`
          });
        }
      )
    );
  });

  it('args null (misskey)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['misskey'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description: 'はらちょは限界開発鯖製なので将来性が心配'
          });
        }
      )
    );
  });
});
