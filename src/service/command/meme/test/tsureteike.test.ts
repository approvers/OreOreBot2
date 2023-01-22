import { describe, expect, it } from 'vitest';

import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';
import { createMockMessage } from '../../command-message.js';
import { Meme } from '../../meme.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of tsureteike', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          [
            'tsureteike',
            'プログラマ',
            'Rustは知っているか?',
            'ゲームですか?',
            '錆のこと?',
            '🦀'
          ],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description:
              '「この中にプログラマはいるか」\nA,B,C「いません」\n「Rustは知っているか?」\nA「ゲームですか?」\nB「錆のこと?」\nC「🦀」\n「いたぞ、Cを連れて行け」'
          });
        }
      )
    );
  });

  it('args null (tsureteike)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['tsureteike'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description: '構文ミスだ、問答無用で連れて行け'
          });
        }
      )
    );
  });
});
