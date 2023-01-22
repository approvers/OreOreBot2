import EventEmitter from 'node:events';

import type {
  VoiceConnection,
  VoiceConnectionFactory
} from '../service/voice-connection.js';

export class MockVoiceConnectionFactory<K>
  implements VoiceConnectionFactory<K>
{
  connectTo(): Promise<VoiceConnection<K>> {
    return Promise.resolve(new MockVoiceConnection());
  }
}

export class MockVoiceConnection<K>
  extends EventEmitter
  implements VoiceConnection<K>
{
  connect(): void {
    this.emit('CONNECT');
  }
  destroy(): void {
    this.emit('DESTROY');
  }

  playToEnd(key: K): Promise<void> {
    this.emit('PLAY_TO_END', key);
    return Promise.resolve();
  }
  play(key: K): void {
    this.emit('PLAY', key);
  }
  pause(): void {
    this.emit('PAUSE');
  }
  unpause(): void {
    this.emit('UNPAUSE');
  }
  onDisconnected(): void {
    this.emit('REGISTER_ON_DISCONNECTED');
  }
}
