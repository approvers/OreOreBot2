import { describe, expect, it } from 'vitest';

import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';
import { createMockMessage } from '../../command-message.js';
import { Meme } from '../../meme.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of clang', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['clang', 'GitHub', 'ラベル'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: 'GitHubの天才\n9つのラベルを操る'
          });
        }
      )
    );
  });

  it('args null (clang)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['clang'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description: 'エラーの天才\n9つの引数エラーを操る'
          });
        }
      )
    );
  });
});
