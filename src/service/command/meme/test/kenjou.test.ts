import { describe, expect, it } from 'vitest';

import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';
import { createMockMessage } from '../../command-message.js';
import { Meme } from '../../meme.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of kenjou', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          [
            'kenjou',
            'ホテルのオートロックの鍵は部屋に置きっぱなしにしないほうがいい'
          ],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description:
              'ホテルのオートロックの鍵は部屋に置きっぱなしにしないほうがいい - 健常者エミュレータ事例集'
          });
        }
      )
    );
  });

  it('args null (kenjou)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['kenjou'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description:
              'はらちょのミーム機能を使うときは引数を忘れない方がいい - 健常者エミュレータ事例集'
          });
        }
      )
    );
  });
});
