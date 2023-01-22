import { describe, expect, it } from 'vitest';

import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';
import { createMockMessage } from '../../command-message.js';
import { Meme } from '../../meme.js';

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

  it('args null (lolicon)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['lolicon'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: 'こるくはロリコンをやめられなかった。',
            title: '引数が不足してるみたいだ。'
          });
        }
      )
    );
  });
});
