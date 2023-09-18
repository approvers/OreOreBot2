import { describe, expect, it } from 'vitest';

import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';
import { createMockMessage } from '../../command-message.js';
import { Meme } from '../../meme.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of failure', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          ['failure', '想定している範囲内で止まることは、失敗と言い難い'],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description:
              '「想定している範囲内で止まることは、失敗と言い難い」\n「わかりました。それは一般に失敗と言います、ありがとうございます」'
          });
        }
      )
    );
  });

  it('use case of failure with option -k', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          [
            'failure',
            '-k',
            '恋',
            'クラスのマドンナが好きなのにいじめてしまいました'
          ],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description:
              '「クラスのマドンナが好きなのにいじめてしまいました」\n「わかりました。それは一般に恋と言います、ありがとうございます」'
          });
        }
      )
    );
  });

  it('args null (failure)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['failure'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description:
              '「わかりました。それは一般に引数エラーと言います、ありがとうございます」'
          });
        }
      )
    );
  });
});
