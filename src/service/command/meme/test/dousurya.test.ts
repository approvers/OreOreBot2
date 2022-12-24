import { describe, expect, it } from 'vitest';
import { Meme } from '../../meme.js';

import { createMockMessage } from '../../command-message.js';
import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of dousurya', async () => {
    /**
     * !dousurya と !dousureba のテストケースです。
     * 一見同じように見えるが、違うので重複してたからと削除しないよう注意してほしい
     */
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['dousurya', 'こるく'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: `限界みたいな鯖に住んでるこるくはどうすりゃいいですか？`
          });
        }
      )
    );
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['dousureba', 'こるく'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: `限界みたいな鯖に住んでるこるくはどうすりゃいいですか？`
          });
        }
      )
    );
  });

  it('args null (dousureba)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['dousureba'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: 'どうしようもない。',
            title: '引数が不足してるみたいだ。'
          });
        }
      )
    );
  });
});
