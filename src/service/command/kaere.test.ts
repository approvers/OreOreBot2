import { expect, it, vi } from 'vitest';

import {
  InMemoryReservationRepository,
  MockClock,
  MockVoiceConnectionFactory
} from '../../adaptor/index.js';
import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';
import { ScheduleRunner } from '../../runner/index.js';
import type { StandardOutput } from '../output.js';
import { createMockMessage } from './command-message.js';
import { KaereCommand, type KaereMusicKey } from './kaere.js';

it('use case of kaere', async () => {
  const fn = vi.fn();
  const connectionFactory = new MockVoiceConnectionFactory<KaereMusicKey>();
  const clock = new MockClock(new Date(0));
  const scheduleRunner = new ScheduleRunner(clock);
  const repo = new InMemoryReservationRepository();

  const output: StandardOutput = {
    sendEmbed(message) {
      expect(message).toStrictEqual({
        title: '提督、もうこんな時間だよ',
        description: '早く寝よう'
      });
      return Promise.resolve();
    }
  };

  const responder = new KaereCommand({
    connectionFactory,
    controller: {
      disconnectAllUsersIn: fn
    },
    clock,
    scheduleRunner,
    stdout: output,
    repo
  });

  await responder.on(
    createMockMessage(
      parseStringsOrThrow(['kaere'], responder.schema),
      (message) => {
        expect(message).toStrictEqual({
          title: '提督、もうこんな時間だよ',
          description: '早く寝よう'
        });
      }
    )
  );

  await responder.on(
    createMockMessage(
      parseStringsOrThrow(['kaere', 'bed', 'status'], responder.schema),
      (message) => {
        expect(message).toStrictEqual({
          title: '強制切断モードは現在無効だよ。'
        });
      }
    )
  );
  await responder.on(
    createMockMessage(
      parseStringsOrThrow(['kaere', 'bed', 'enable'], responder.schema),
      (message) => {
        expect(message).toStrictEqual({
          title: '強制切断モードを有効化したよ。'
        });
      }
    )
  );
  await responder.on(
    createMockMessage(
      parseStringsOrThrow(['kaere', 'bed', 'status'], responder.schema),
      (message) => {
        expect(message).toStrictEqual({
          title: '強制切断モードは現在有効だよ。'
        });
      }
    )
  );
  await responder.on(
    createMockMessage(
      parseStringsOrThrow(['kaere', 'bed', 'disable'], responder.schema),
      (message) => {
        expect(message).toStrictEqual({
          title: '強制切断モードを無効化したよ。'
        });
      }
    )
  );
  await responder.on(
    createMockMessage(
      parseStringsOrThrow(['kaere', 'bed', 'status'], responder.schema),
      (message) => {
        expect(message).toStrictEqual({
          title: '強制切断モードは現在無効だよ。'
        });
      }
    )
  );

  await responder.on(
    createMockMessage(
      parseStringsOrThrow(
        ['kaere', 'reserve', 'add', '01:0'],
        responder.schema
      ),
      (message) => {
        expect(message).toStrictEqual({
          title: '予約に成功したよ。',
          description: '午前1時0分に予約を入れておくね。'
        });
      }
    )
  );
  await responder.on(
    createMockMessage(
      parseStringsOrThrow(['kaere', 'reserve', 'list'], responder.schema),
      (message) => {
        expect(message).toStrictEqual({
          title: '現在の予約状況をお知らせするね。',
          description: '- 午前1時0分'
        });
      }
    )
  );
  await responder.on(
    createMockMessage(
      parseStringsOrThrow(
        ['kaere', 'reserve', 'cancel', '01:0'],
        responder.schema
      ),
      (message) => {
        expect(message).toStrictEqual({
          title: '予約キャンセルに成功したよ。',
          description: '午前1時0分の予約はキャンセルしておくね。'
        });
      }
    )
  );
  await responder.on(
    createMockMessage(
      parseStringsOrThrow(['kaere', 'reserve', 'list'], responder.schema),
      (message) => {
        expect(message).toStrictEqual({
          title: '今は誰も予約してないようだね。'
        });
      }
    )
  );

  scheduleRunner.killAll();
});
