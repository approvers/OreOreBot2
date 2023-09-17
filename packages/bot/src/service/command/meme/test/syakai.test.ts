import { describe, expect, it } from 'vitest';

import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';
import { createMockMessage } from '../../command-message.js';
import { Meme } from '../../meme.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of syakai', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['syakai', 'Rust採用'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description:
              '「首相、Rust採用に否定的な考え ― 『社会が変わってしまう』」'
          });
        }
      )
    );
  });

  it('args null (syakai)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['syakai'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description: '極めて慎重に検討すべき課題だ'
          });
        }
      )
    );
  });
});
