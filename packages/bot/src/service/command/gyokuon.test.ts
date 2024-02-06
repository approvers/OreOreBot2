import { describe, expect, it, vi } from 'vitest';

import { MockVoiceConnectionFactory } from '../../adaptor/index.js';
import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';
import { DepRegistry } from '../../driver/dep-registry.js';
import { voiceRoomControllerKey } from '../../model/voice-room-controller.js';
import { voiceConnectionFactoryKey } from '../voice-connection.js';
import { createMockMessage } from './command-message.js';
import { type GyokuonAssetKey, GyokuonCommand } from './gyokuon.js';

describe('play gyokuon', () => {
  const fn = vi.fn();
  const reg = new DepRegistry();
  const connectionFactory = new MockVoiceConnectionFactory<GyokuonAssetKey>();
  reg.add(voiceConnectionFactoryKey, connectionFactory);
  reg.add(voiceRoomControllerKey, { disconnectAllUsersIn: fn });
  const responder = new GyokuonCommand(reg);

  it('use case of gyokuon', async () => {
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

  it('use case of gyokuon (short)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['gyokuon', 'true'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: 'こるく天皇の玉音放送だよ',
            description: '全鯖民に対しての大詔だから椅子から立って聞いてね'
          });
        }
      )
    );
  });
});
