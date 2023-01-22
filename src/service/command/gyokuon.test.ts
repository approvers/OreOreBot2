import { expect, it, vi } from 'vitest';

import { MockVoiceConnectionFactory } from '../../adaptor/index.js';
import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';
import { createMockMessage } from './command-message.js';
import { GyokuonAssetKey, GyokuonCommand } from './gyokuon.js';

it('use case of gyokuon', async () => {
  const fn = vi.fn();
  const connectionFactory = new MockVoiceConnectionFactory<GyokuonAssetKey>();
  const responder = new GyokuonCommand({
    connectionFactory,
    controller: {
      disconnectAllUsersIn: fn
    }
  });

  await responder.on(
    createMockMessage(
      parseStringsOrThrow(['gyokuon'], responder.schema),
      (message) => {
        expect(message).toStrictEqual({
          title: 'こるく天皇の玉音放送だよ',
          description: '全鯖民に対しての大詔だから椅子から立って聞いてね'
        });
      }
    )
  );
});
