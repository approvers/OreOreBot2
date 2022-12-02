import { describe, expect, it } from 'vitest';
import { Meme } from '../../meme.js';

import { createMockMessage } from '../../command-message.js';
import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of moeta', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['moeta', '雪'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description:
              '「久留米の花火大会ね、寮から見れたの?」\n「うん ついでに雪が燃えた」\n「は?」'
          });
        }
      )
    );
  });
});
