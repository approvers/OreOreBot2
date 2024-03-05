import { describe, expect, it } from 'bun:test';

import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';
import { createMockMessage } from '../../command-message.js';
import { Meme } from '../../meme.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of n', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          ['n', 'テスト前に課題もやらないで原神してて'],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description: `テスト前に課題もやらないで原神しててNった`
          });
        }
      )
    );
  });

  it('args null (n)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['n'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description:
              'このままだと <@521958252280545280> みたいに留年しちゃう....'
          });
        }
      )
    );
  });
});
