import { GyokuonAssetKey, GyokuonCommand } from './gyokuon.js';
import { it, vi } from 'vitest';

import { MockVoiceConnectionFactory } from '../../adaptor/index.js';
import { createMockMessage } from './command-message.js';
import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';

it('use case of kaere', async () => {
  const fn = vi.fn();
  const connectionFactory = new MockVoiceConnectionFactory<GyokuonAssetKey>();
  const responder = new GyokuonCommand({
    connectionFactory,
    controller: {
      disconnectAllUsersIn: fn
    }
  });

  await responder.on(
    createMockMessage(parseStringsOrThrow(['gyokuon'], responder.schema))
  );
});
