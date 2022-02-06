import EventEmitter from 'events';
import { MockClock } from '../adaptor';
import type { Snowflake } from '../model/id';
import { ScheduleRunner } from '../runner';
import { AssetKey, PartyCommand, RandomGenerator } from './party';
import type {
  VoiceConnection,
  VoiceConnectionFactory
} from './voice-connection';

class MockVoiceConnectionFactory implements VoiceConnectionFactory<AssetKey> {
  connectSameTo(): Promise<VoiceConnection<AssetKey>> {
    return Promise.resolve(new MockVoiceConnection());
  }
}

class MockVoiceConnection
  extends EventEmitter
  implements VoiceConnection<AssetKey>
{
  connect(): void {
    this.emit('CONNECT');
  }
  destroy(): void {
    this.emit('DESTROY');
  }

  playToEnd(key: AssetKey): Promise<void> {
    this.emit('PLAY_TO_END', key);
    return Promise.resolve();
  }
  play(key: AssetKey): void {
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

const randomGen: RandomGenerator = {
  minutes: () => 42,
  pick: ([first]) => first
};

test('show all typos', async () => {
  const factory = new MockVoiceConnectionFactory();
  const clock = new MockClock(new Date(0));
  const runner = new ScheduleRunner(clock);
  const responder = new PartyCommand(factory, clock, runner, randomGen);

  await responder.on('CREATE', {
    senderId: '279614913129742338' as Snowflake,
    senderGuildId: '683939861539192860' as Snowflake,
    senderName: 'Mikuroさいな',
    args: ['party'],
    reply: (message) => {
      expect(message).toStrictEqual({
        title: `パーティー Nigth`,
        description: 'хорошо、宴の始まりだ。'
      });
      return Promise.resolve();
    }
  });

  await responder.on('CREATE', {
    senderId: '279614913129742338' as Snowflake,
    senderGuildId: '683939861539192860' as Snowflake,
    senderName: 'Mikuroさいな',
    args: ['party', 'status'],
    reply: (message) => {
      expect(message).toStrictEqual({
        title: 'ゲリラは現在無効だよ。'
      });
      return Promise.resolve();
    }
  });
  await responder.on('CREATE', {
    senderId: '279614913129742338' as Snowflake,
    senderGuildId: '683939861539192860' as Snowflake,
    senderName: 'Mikuroさいな',
    args: ['party', 'enable'],
    reply: (message) => {
      expect(message).toStrictEqual({
        title: 'ゲリラを有効化しておいたよ。'
      });
      return Promise.resolve();
    }
  });
  await responder.on('CREATE', {
    senderId: '279614913129742338' as Snowflake,
    senderGuildId: '683939861539192860' as Snowflake,
    senderName: 'Mikuroさいな',
    args: ['party', 'status'],
    reply: (message) => {
      expect(message).toStrictEqual({
        title: 'ゲリラは現在有効だよ。'
      });
      return Promise.resolve();
    }
  });
  await responder.on('CREATE', {
    senderId: '279614913129742338' as Snowflake,
    senderGuildId: '683939861539192860' as Snowflake,
    senderName: 'Mikuroさいな',
    args: ['party', 'disable'],
    reply: (message) => {
      expect(message).toStrictEqual({
        title: 'ゲリラを無効化しておいたよ。'
      });
      return Promise.resolve();
    }
  });
  await responder.on('CREATE', {
    senderId: '279614913129742338' as Snowflake,
    senderGuildId: '683939861539192860' as Snowflake,
    senderName: 'Mikuroさいな',
    args: ['party', 'status'],
    reply: (message) => {
      expect(message).toStrictEqual({
        title: 'ゲリラは現在無効だよ。'
      });
      return Promise.resolve();
    }
  });

  await responder.on('CREATE', {
    senderId: '279614913129742338' as Snowflake,
    senderGuildId: '683939861539192860' as Snowflake,
    senderName: 'Mikuroさいな',
    args: ['party', 'time'],
    reply: (message) => {
      expect(message).toStrictEqual({
        title: '次のゲリラ参加時刻を42分にしたよ。'
      });
      return Promise.resolve();
    }
  });
  await responder.on('CREATE', {
    senderId: '279614913129742338' as Snowflake,
    senderGuildId: '683939861539192860' as Snowflake,
    senderName: 'Mikuroさいな',
    args: ['party', 'time', '36'],
    reply: (message) => {
      expect(message).toStrictEqual({
        title: '次のゲリラ参加時刻を36分にしたよ。'
      });
      return Promise.resolve();
    }
  });

  await responder.on('CREATE', {
    senderId: '279614913129742338' as Snowflake,
    senderGuildId: '683939861539192860' as Snowflake,
    senderName: 'Mikuroさいな',
    args: ['party', 'set', '__UNKNOWN__'],
    reply: (message) => {
      expect(message.title).toStrictEqual('BGMを設定できなかった。');
      return Promise.resolve();
    }
  });

  runner.killAll();
});

test('must not reply', async () => {
  const factory = new MockVoiceConnectionFactory();
  const clock = new MockClock(new Date(0));
  const runner = new ScheduleRunner(clock);
  const responder = new PartyCommand(factory, clock, runner, randomGen);

  const fn = jest.fn();
  await responder.on('CREATE', {
    senderId: '279614913129742338' as Snowflake,
    senderGuildId: '683939861539192860' as Snowflake,
    senderName: 'Mikuroさいな',
    args: ['typo'],
    reply: fn
  });
  await responder.on('CREATE', {
    senderId: '279614913129742338' as Snowflake,
    senderGuildId: '683939861539192860' as Snowflake,
    senderName: 'Mikuroさいな',
    args: ['partyichiyo'],
    reply: fn
  });
  await responder.on('DELETE', {
    senderId: '279614913129742338' as Snowflake,
    senderGuildId: '683939861539192860' as Snowflake,
    senderName: 'Mikuroさいな',
    args: ['party'],
    reply: fn
  });
  expect(fn).not.toHaveBeenCalled();

  runner.killAll();
});
