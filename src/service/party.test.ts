import { type AssetKey, PartyCommand, type RandomGenerator } from './party';
import { MockClock } from '../adaptor';
import { MockVoiceConnectionFactory } from '../adaptor';
import { ScheduleRunner } from '../runner';
import { createMockMessage } from './command-message';

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
    createMockMessage(
      {
        args: ['party']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: `パーティー Nigth`,
          description: 'хорошо、宴の始まりだ。'
        });
        return Promise.resolve();
      }
    )
  );

  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['party', 'status']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: 'ゲリラは現在無効だよ。'
        });
        return Promise.resolve();
      }
    )
  );
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['party', 'enable']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: 'ゲリラを有効化しておいたよ。'
        });
        return Promise.resolve();
      }
    )
  );
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['party', 'status']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: 'ゲリラは現在有効だよ。'
        });
        return Promise.resolve();
      }
    )
  );
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['party', 'disable']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: 'ゲリラを無効化しておいたよ。'
        });
        return Promise.resolve();
      }
    )
  );
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['party', 'status']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: 'ゲリラは現在無効だよ。'
        });
        return Promise.resolve();
      }
    )
  );

  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['party', 'time']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: '次のゲリラ参加時刻を42分にしたよ。'
        });
        return Promise.resolve();
      }
    )
  );
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['party', 'time', '36']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: '次のゲリラ参加時刻を36分にしたよ。'
        });
        return Promise.resolve();
      }
    )
  );

  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['party', 'set', '__UNKNOWN__']
      },
      (message) => {
        expect(message.title).toStrictEqual('BGMを設定できなかった。');
        return Promise.resolve();
      }
    )
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
      args: ['typo']
    })
  );
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['partyichiyo']
    })
  );
  await responder.on(
    'DELETE',
    createMockMessage({
      args: ['party']
    })
  );
  expect(fn).not.toHaveBeenCalled();

  runner.killAll();
});
