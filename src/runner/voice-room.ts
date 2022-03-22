export type VoiceRoomEvent =
  | 'JOIN'
  | 'LEAVE'
  | 'MUTE'
  | 'DEAFEN'
  | 'UNMUTE'
  | 'UNDEAFEN';

/**
 * `VoiceRoomResponseRunner` に登録する機能が実装するインターフェイス。`V` には discord.js の `VoiceState` などが入る。
 *
 * @export
 * @interface VoiceRoomEventResponder
 * @template V
 */
export interface VoiceRoomEventResponder<V> {
  on(event: VoiceRoomEvent, voiceState: V): Promise<void>;
}

/**
 * `VoiceRoomResponseRunner` のためにボイスチャンネルに関するイベントハンドラの登録手段を提供する。
 *
 * @export
 * @interface VoiceRoomEventProvider
 * @template V
 */
export interface VoiceRoomEventProvider<V> {
  onJoin(handler: (voiceState: V) => Promise<void>): void;
  onLeave(handler: (voiceState: V) => Promise<void>): void;
  onMute(handler: (voiceState: V) => Promise<void>): void;
  onDeafen(handler: (voiceState: V) => Promise<void>): void;
  onUnmute(handler: (voiceState: V) => Promise<void>): void;
  onUndeafen(handler: (voiceState: V) => Promise<void>): void;
}

/**
 * ボイスチャンネルの変化に反応するタイプの機能を登録すると、`VoiceRoomEventProvider` からのイベントを `VoiceRoomEvent` 付きの形式に変換し、それに渡して実行する。
 *
 * @export
 * @class VoiceRoomResponseRunner
 * @template V
 */
export class VoiceRoomResponseRunner<V> {
  constructor(provider: VoiceRoomEventProvider<V>) {
    provider.onJoin((v) => this.triggerEvent('JOIN', v));
    provider.onLeave((v) => this.triggerEvent('LEAVE', v));
    provider.onMute((v) => this.triggerEvent('MUTE', v));
    provider.onDeafen((v) => this.triggerEvent('DEAFEN', v));
    provider.onUnmute((v) => this.triggerEvent('UNMUTE', v));
    provider.onUndeafen((v) => this.triggerEvent('UNDEAFEN', v));
  }

  private async triggerEvent(
    event: VoiceRoomEvent,
    voiceState: V
  ): Promise<void> {
    try {
      await Promise.all(
        this.responders.map((res) => res.on(event, voiceState))
      );
    } catch (e) {
      console.error(e);
    }
  }

  private responders: VoiceRoomEventResponder<V>[] = [];

  addResponder(responder: VoiceRoomEventResponder<V>) {
    this.responders.push(responder);
  }
}
