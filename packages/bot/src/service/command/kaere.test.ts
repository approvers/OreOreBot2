import { expect, it, vi } from 'vitest';

import {
  InMemoryReservationRepository,
  MockClock,
  MockVoiceConnectionFactory
} from '../../adaptor/index.js';
import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';
import { DepRegistry } from '../../driver/dep-registry.js';
import { voiceRoomControllerKey } from '../../model/voice-room-controller.js';
import {
  ScheduleRunner,
  clockKey,
  scheduleRunnerKey
} from '../../runner/index.js';
import { standardOutputKey } from '../output.js';
import { voiceConnectionFactoryKey } from '../voice-connection.js';
import { createMockMessage } from './command-message.js';
import {
  KaereCommand,
  reservationRepositoryKey,
  type KaereMusicKey
} from './kaere.js';

it('use case of kaere', async () => {
  const fn = vi.fn();
  const reg = new DepRegistry();
  const connectionFactory = new MockVoiceConnectionFactory<KaereMusicKey>();
  reg.add(voiceConnectionFactoryKey, connectionFactory);
  const clock = new MockClock(new Date(0));
  reg.add(clockKey, clock);
  const scheduleRunner = new ScheduleRunner(reg);
  reg.add(scheduleRunnerKey, scheduleRunner);
  const repo = new InMemoryReservationRepository();
  reg.add(reservationRepositoryKey, repo);
  reg.add(voiceRoomControllerKey, {
    disconnectAllUsersIn: fn
  });
  reg.add(standardOutputKey, {
    sendEmbed(message) {
      expect(message).toStrictEqual({
        title: '提督、もうこんな時間だよ',
        description: '早く寝よう'
      });
      return Promise.resolve();
    }
  });

  const responder = new KaereCommand(reg);

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
      parseStringsOrThrow(['kaere', 'start'], responder.schema),
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
