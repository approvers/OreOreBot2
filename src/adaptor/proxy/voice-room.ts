import type { Client, VoiceState } from 'discord.js';

import type { VoiceRoomEventProvider } from '../../runner/index.js';

type ObserveExpectation = 'ChangingIntoFalsy' | 'ChangingIntoTruthy' | 'All';

/**
 * `VoiceState` を受け渡す場合の `VoiceRoomEventProvider` を実装したクラス。
 *
 * @export
 * @class VoiceRoomProxy
 * @implements {VoiceRoomEventProvider<VoiceState>}
 */
export class VoiceRoomProxy<V> implements VoiceRoomEventProvider<V> {
  constructor(
    private readonly client: Client,
    private readonly map: (voiceState: VoiceState) => V
  ) {}

  private registerHandler(
    handler: (v: V) => Promise<void>,
    toObserve: keyof VoiceState,
    expected: ObserveExpectation
  ): void {
    this.client.on('voiceStateUpdate', async (oldState, newState) => {
      if (oldState.member?.user.bot) {
        return;
      }
      if (
        oldState[toObserve] !== newState[toObserve] &&
        ((expected === 'ChangingIntoFalsy' && !newState[toObserve]) ||
          (expected === 'ChangingIntoTruthy' && !!newState[toObserve]) ||
          expected === 'All')
      ) {
        let vcState: VoiceState;
        if (expected === 'ChangingIntoFalsy') {
          vcState = oldState;
        } else {
          vcState = newState;
        }
        await handler(this.map(vcState));
      }
    });
  }

  onJoin(handler: (voiceState: V) => Promise<void>): void {
    this.registerHandler(handler, 'channelId', 'ChangingIntoTruthy');
  }

  onLeave(handler: (voiceState: V) => Promise<void>): void {
    this.registerHandler(handler, 'channelId', 'ChangingIntoFalsy');
  }

  onMute(handler: (voiceState: V) => Promise<void>): void {
    this.registerHandler(handler, 'mute', 'ChangingIntoTruthy');
  }

  onDeafen(handler: (voiceState: V) => Promise<void>): void {
    this.registerHandler(handler, 'deaf', 'ChangingIntoTruthy');
  }

  onUnmute(handler: (voiceState: V) => Promise<void>): void {
    this.registerHandler(handler, 'mute', 'ChangingIntoFalsy');
  }

  onUndeafen(handler: (voiceState: V) => Promise<void>): void {
    this.registerHandler(handler, 'deaf', 'ChangingIntoFalsy');
  }
}
