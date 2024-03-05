import { describe, expect, it } from 'bun:test';

import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';
import { createMockMessage } from '../../command-message.js';
import { Meme } from '../../meme.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of hukueki', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['hukueki', 'こるく'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description:
              'ねぇ、将来何してるだろうね\n' +
              'こるくはしてないといいね\n' +
              '困らないでよ'
          });
        }
      )
    );
  });

  it('args null (hukueki)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['hukueki'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: '服役できなかった。',
            title: '引数が不足してるみたいだ。'
          });
        }
      )
    );
  });
});
