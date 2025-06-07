import { describe, expect, it } from 'vitest';

import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';
import { createMockMessage } from '../../command-message.js';
import { Meme } from '../../meme.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of oss', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['oss', '高専生'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description:
              `えっ、丸パクリじゃん。
せめてどこから取ってきたかぐらい
もっと書くべき。
高専生だからって、何でも許されるわけと
ちゃうやろ・・・
高専生って基本こういうイメージ、怖い・・・`
          });
        }
      )
    );
  });

  it('args null (oss)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['oss'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description: '【急募】批評対象'
          });
        }
      )
    );
  });
});
