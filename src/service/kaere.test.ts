import { KaereCommand, KaereMusicKey } from './kaere';
import { InMemoryReservationRepository } from '../adaptor/in-memory-reservation';
import { MockClock } from '../adaptor';
import { MockVoiceConnectionFactory } from '../adaptor/mock-voice';
import { ScheduleRunner } from '../runner';
import { createMockMessage } from './command-message';

test('use case of kaere', async () => {
  const fn = jest.fn();
  const factory = new MockVoiceConnectionFactory<KaereMusicKey>();
  const clock = new MockClock(new Date(0));
  const runner = new ScheduleRunner(clock);
  const repo = new InMemoryReservationRepository();
  const responder = new KaereCommand(
    factory,
    {
      disconnectAllUsersIn: fn
    },
    clock,
    runner,
    repo
  );

  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['kaere']
    })
  );

  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['kaere', 'bed', 'status'],
      reply: (message) => {
        expect(message).toStrictEqual({
          title: '強制切断モードは現在無効だよ。'
        });
        return Promise.resolve();
      }
    })
  );
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['kaere', 'bed', 'enable'],
      reply: (message) => {
        expect(message).toStrictEqual({
          title: '強制切断モードを有効化したよ。'
        });
        return Promise.resolve();
      }
    })
  );
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['kaere', 'bed', 'status'],
      reply: (message) => {
        expect(message).toStrictEqual({
          title: '強制切断モードは現在有効だよ。'
        });
        return Promise.resolve();
      }
    })
  );
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['kaere', 'bed', 'disable'],
      reply: (message) => {
        expect(message).toStrictEqual({
          title: '強制切断モードを無効化したよ。'
        });
        return Promise.resolve();
      }
    })
  );
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['kaere', 'bed', 'status'],
      reply: (message) => {
        expect(message).toStrictEqual({
          title: '強制切断モードは現在無効だよ。'
        });
        return Promise.resolve();
      }
    })
  );

  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['kaere', 'reserve', 'add', '01:0'],
      reply: (message) => {
        expect(message).toStrictEqual({
          title: '予約に成功したよ。',
          description: '午前1時0分に予約を入れておくね。'
        });
        return Promise.resolve();
      }
    })
  );
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['kaere', 'reserve', 'list'],
      reply: (message) => {
        expect(message).toStrictEqual({
          title: '現在の予約状況をお知らせするね。',
          description: '- 午前1時0分'
        });
        return Promise.resolve();
      }
    })
  );
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['kaere', 'reserve', 'cancel', '1:00'],
      reply: (message) => {
        expect(message).toStrictEqual({
          title: '予約キャンセルに成功したよ。',
          description: '午前1時0分の予約はキャンセルしておくね。'
        });
        return Promise.resolve();
      }
    })
  );
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['kaere', 'reserve', 'list'],
      reply: (message) => {
        expect(message).toStrictEqual({
          title: '今は誰も予約してないようだね。'
        });
        return Promise.resolve();
      }
    })
  );

  runner.killAll();
});

test('must not reply', async () => {
  const fn = jest.fn();
  const factory = new MockVoiceConnectionFactory<KaereMusicKey>();
  const clock = new MockClock(new Date(0));
  const runner = new ScheduleRunner(clock);
  const repo = new InMemoryReservationRepository();
  const responder = new KaereCommand(
    factory,
    {
      disconnectAllUsersIn: fn
    },
    clock,
    runner,
    repo
  );

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
      args: ['party'],
      reply: fn
    })
  );
  await responder.on(
    'DELETE',
    createMockMessage({
      args: ['kaere'],
      reply: fn
    })
  );
  expect(fn).not.toHaveBeenCalled();

  runner.killAll();
});
