import { describe, expect, it } from 'bun:test';

import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';
import { createMockMessage } from '../../command-message.js';
import { Meme } from '../../meme.js';

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

  it('args null (koume)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['koume'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description:
              'MEMEを表示しようと思ったら〜♪ 引数が足りませんでした〜♪ チクショー！！'
          });
        }
      )
    );
  });
});
