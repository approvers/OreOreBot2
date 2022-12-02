import { describe, expect, it } from 'vitest';
import { Meme } from '../../meme.js';

import { createMockMessage } from '../../command-message.js';
import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of lolicon', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          ['lolicon', 'こるく', 'にえっちを申し込む'],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description: `だから僕はこるく にえっちを申し込むを辞めた - める (Music Video)`
          });
        },
        {
          senderName: 'める'
        }
      )
    );
  });
});
