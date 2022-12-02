import { describe, expect, it } from 'vitest';
import { Meme } from '../../meme.js';

import { createMockMessage } from '../../command-message.js';
import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of web3', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['web3', 'Rust'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description:
              '```\n「いちばんやさしいRustの教本」 - インプレス \n```'
          });
        }
      )
    );
  });

  it('args null (web3)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['web3'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description:
              'TCP/IP、SMTP、HTTPはGoogleやAmazonに独占されています。'
          });
        }
      )
    );
  });
});
