import { describe, expect, it } from 'vitest';
import { Meme } from '../../meme.js';

import { createMockMessage } from '../../command-message.js';
import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of n', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          ['n', 'テスト前に課題もやらないで原神してて'],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description: `テスト前に課題もやらないで原神しててNった`
          });
        }
      )
    );
  });
});
