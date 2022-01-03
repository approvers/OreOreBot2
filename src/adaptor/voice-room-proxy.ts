import { Client, VoiceState } from 'discord.js';
import { VoiceRoomEventProvider } from '../runner';

type ObserveExpectation = 'ChangingIntoFalsy' | 'ChangingIntoTruthy' | 'All';

export class VoiceRoomProxy implements VoiceRoomEventProvider<VoiceState> {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly client: Client) {}

  private registerHandler(
    handler: (v: VoiceState) => Promise<void>,
    toObserve: keyof VoiceState,
    expected: ObserveExpectation
  ): void {
    this.client.on('voiceStateUpdate', async (oldState, newState) => {
      if (
        oldState[toObserve] !== newState[toObserve] &&
        ((expected === 'ChangingIntoFalsy' && !newState[toObserve]) ||
          (expected === 'ChangingIntoTruthy' && !!newState[toObserve]) ||
          expected === 'All')
      ) {
        await handler(newState);
      }
    });
  }

  onJoin(handler: (voiceState: VoiceState) => Promise<void>): void {
    this.registerHandler(handler, 'channelId', 'ChangingIntoTruthy');
  }

  onLeave(handler: (voiceState: VoiceState) => Promise<void>): void {
    this.registerHandler(handler, 'channelId', 'ChangingIntoFalsy');
  }

  onMute(handler: (voiceState: VoiceState) => Promise<void>): void {
    this.registerHandler(handler, 'mute', 'ChangingIntoTruthy');
  }

  onDeafen(handler: (voiceState: VoiceState) => Promise<void>): void {
    this.registerHandler(handler, 'deaf', 'ChangingIntoTruthy');
  }

  onUnmute(handler: (voiceState: VoiceState) => Promise<void>): void {
    this.registerHandler(handler, 'mute', 'ChangingIntoFalsy');
  }

  onUndeafen(handler: (voiceState: VoiceState) => Promise<void>): void {
    this.registerHandler(handler, 'deaf', 'ChangingIntoFalsy');
  }
}
