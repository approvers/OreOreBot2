import { AssetKey, PartyCommand, RandomGenerator } from './party';
import { MockClock } from '../adaptor';
import { ScheduleRunner } from '../runner';
import { createMockMessage } from './command-message';
import { MockVoiceConnectionFactory } from '../adaptor';

const randomGen: RandomGenerator = {
  minutes: () => 42,
  pick: ([first]) => first
};

test('use case of party', async () => {
  const factory = new MockVoiceConnectionFactory<AssetKey>();
  const clock = new MockClock(new Date(0));
  const runner = new ScheduleRunner(clock);
  const responder = new PartyCommand(factory, clock, runner, randomGen);

  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['party'],
      reply: (message) => {
        expect(message).toStrictEqual({
          title: `パーティー Nigth`,
          description: 'хорошо、宴の始まりだ。'
        });
        return Promise.resolve();
      }
    })
  );

  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['party', 'status'],
      reply: (message) => {
        expect(message).toStrictEqual({
          title: 'ゲリラは現在無効だよ。'
        });
        return Promise.resolve();
      }
    })
  );
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['party', 'enable'],
      reply: (message) => {
        expect(message).toStrictEqual({
          title: 'ゲリラを有効化しておいたよ。'
        });
        return Promise.resolve();
      }
    })
  );
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['party', 'status'],
      reply: (message) => {
        expect(message).toStrictEqual({
          title: 'ゲリラは現在有効だよ。'
        });
        return Promise.resolve();
      }
    })
  );
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['party', 'disable'],
      reply: (message) => {
        expect(message).toStrictEqual({
          title: 'ゲリラを無効化しておいたよ。'
        });
        return Promise.resolve();
      }
    })
  );
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['party', 'status'],
      reply: (message) => {
        expect(message).toStrictEqual({
          title: 'ゲリラは現在無効だよ。'
        });
        return Promise.resolve();
      }
    })
  );

  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['party', 'time'],
      reply: (message) => {
        expect(message).toStrictEqual({
          title: '次のゲリラ参加時刻を42分にしたよ。'
        });
        return Promise.resolve();
      }
    })
  );
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['party', 'time', '36'],
      reply: (message) => {
        expect(message).toStrictEqual({
          title: '次のゲリラ参加時刻を36分にしたよ。'
        });
        return Promise.resolve();
      }
    })
  );

  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['party', 'set', '__UNKNOWN__'],
      reply: (message) => {
        expect(message.title).toStrictEqual('BGMを設定できなかった。');
        return Promise.resolve();
      }
    })
  );

  runner.killAll();
});

test('must not reply', async () => {
  const factory = new MockVoiceConnectionFactory();
  const clock = new MockClock(new Date(0));
  const runner = new ScheduleRunner(clock);
  const responder = new PartyCommand(factory, clock, runner, randomGen);

  const fn = jest.fn();
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['typo'],
      reply: fn
    })
  );
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['partyichiyo'],
      reply: fn
    })
  );
  await responder.on(
    'DELETE',
    createMockMessage({
      args: ['party'],
      reply: fn
    })
  );
  expect(fn).not.toHaveBeenCalled();

  runner.killAll();
});
