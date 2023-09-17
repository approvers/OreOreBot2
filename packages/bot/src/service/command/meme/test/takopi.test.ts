import { describe, expect, it } from 'vitest';

import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';
import { createMockMessage } from '../../command-message.js';
import { Meme } from '../../meme.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of takopi', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['takopi', 'こるく'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: `教員「こるく、出して」\nりにあ「わ、わかんないっピ.......」`
          });
        },
        {
          senderName: 'りにあ'
        }
      )
    );
  });

  it('use case of takopi (-f)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['takopi', '-f', 'こるく'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: `りにあ「こるく、出して」\n教員「わ、わかんないっピ.......」`
          });
        },
        {
          senderName: 'りにあ'
        }
      )
    );
  });

  it('use case of takopi (-c)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          ['takopi', '-c', 'こるく', 'いっそう'],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description: `こるく「いっそう、出して」\nりにあ「わ、わかんないっピ.......」`
          });
        },
        {
          senderName: 'りにあ'
        }
      )
    );
  });

  it('use case of takopi (-f, -c)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          ['takopi', '-f', '-c', 'こるく', 'いっそう'],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description: `りにあ「いっそう、出して」\nこるく「わ、わかんないっピ.......」`
          });
        },
        {
          senderName: 'りにあ'
        }
      )
    );
  });

  it('few arguments of takopi (-c)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['takopi', '-c', 'こるく'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: '(引数が)わ、わかんないっピ.......',
            title: '引数が不足してるみたいだ。'
          });
        }
      )
    );
  });

  it('args null (takopi)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['takopi'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: '(引数が)わ、わかんないっピ.......',
            title: '引数が不足してるみたいだ。'
          });
        }
      )
    );
  });
});
