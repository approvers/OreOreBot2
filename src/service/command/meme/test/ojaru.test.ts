import { describe, expect, it } from 'vitest';
import { Meme } from '../../meme.js';

import { createMockMessage } from '../../command-message.js';
import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of ojaru', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          ['ojaru', '欠課時数で落単をふやし、留年を確定な'],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description:
              'あっぱれおじゃる様！見事欠課時数で落単をふやし、留年を確定なされました！'
          });
        }
      )
    );
  });

  it('use case of ojaru (-g option)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          ['ojaru', '-g', '数学の成績不足で管理者からタイムアウト'],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description:
              'あっぱれおじゃる様！数学の成績不足で管理者からタイムアウトでございます！'
          });
        }
      )
    );
  });

  it('args null (ojaru)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['ojaru'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description:
              'あっぱれおじゃる様！コマンド形式を間違えエラーをお出しになられました！'
          });
        }
      )
    );
  });
});
