import { describe, expect, it } from 'vitest';
import { Meme } from '../../meme.js';

import { createMockMessage } from '../../command-message.js';
import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of koume', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          ['koume', 'RSA鍵を登録した', 'ed25519'],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description:
              'RSA鍵を登録したと思ったら〜♪\n\ned25519でした〜♪\n\nチクショー！！　#まいにちチクショー'
          });
        }
      )
    );
  });
});
