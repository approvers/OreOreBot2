export type VoiceRoomEvent =
  | 'JOIN'
  | 'LEAVE'
  | 'MUTE'
  | 'DEAFEN'
  | 'UNMUTE'
  | 'UNDEAFEN'

export interface VoiceRoomEventResponder<V> {
  on(event: VoiceRoomEvent, voiceState: V): Promise<void>
}

export interface VoiceRoomEventProvider<V> {
  onJoin(handler: (voiceState: V) => Promise<void>): void
  onLeave(handler: (voiceState: V) => Promise<void>): void
  onMute(handler: (voiceState: V) => Promise<void>): void
  onDeafen(handler: (voiceState: V) => Promise<void>): void
  onUnmute(handler: (voiceState: V) => Promise<void>): void
  onUndeafen(handler: (voiceState: V) => Promise<void>): void
}

export class VoiceRoomResponseRunner<V> {
  constructor(provider: VoiceRoomEventProvider<V>) {
    provider.onJoin((v) => this.triggerEvent('JOIN', v))
    provider.onLeave((v) => this.triggerEvent('LEAVE', v))
    provider.onMute((v) => this.triggerEvent('MUTE', v))
    provider.onDeafen((v) => this.triggerEvent('DEAFEN', v))
    provider.onUnmute((v) => this.triggerEvent('UNMUTE', v))
    provider.onUndeafen((v) => this.triggerEvent('UNDEAFEN', v))
  }

  private async triggerEvent(
    event: VoiceRoomEvent,
    voiceState: V
  ): Promise<void> {
    await Promise.all(this.responders.map((res) => res.on(event, voiceState)))
  }

  private responders: VoiceRoomEventResponder<V>[] = []

  addResponder(responder: VoiceRoomEventResponder<V>) {
    this.responders.push(responder)
  }
}
