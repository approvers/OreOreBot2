import { afterAll, describe, expect, it, vi } from 'vitest';

import { MockClock, MockVoiceConnectionFactory } from '../../adaptor/index.js';
import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';
import type { EmbedMessage } from '../../model/embed-message.js';
import { ScheduleRunner } from '../../runner/index.js';
import { createMockMessage } from './command-message.js';
import { type AssetKey, PartyCommand, type RandomGenerator } from './party.js';

const random: RandomGenerator = {
  minutes: () => 42,
  pick: ([first]) => first
};

describe('party ichiyo', () => {
  const factory = new MockVoiceConnectionFactory<AssetKey>();
  const clock = new MockClock(new Date(0));
  const scheduleRunner = new ScheduleRunner(clock);
  const responder = new PartyCommand({
    factory,
    clock,
    scheduleRunner,
    random
  });

  afterAll(() => scheduleRunner.killAll());

  it('with no options', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['party'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: `パーティー Nigth`,
            description: 'хорошо、宴の始まりだ。'
          });
        }
      )
    );
  });

  it('use case of party', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['party', 'status'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: 'ゲリラは現在無効だよ。'
          });
        }
      )
    );
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['party', 'enable'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: 'ゲリラを有効化しておいたよ。'
          });
        }
      )
    );
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['party', 'status'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: 'ゲリラは現在有効だよ。'
          });
        }
      )
    );
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['party', 'disable'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: 'ゲリラを無効化しておいたよ。'
          });
        }
      )
    );
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['party', 'status'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: 'ゲリラは現在無効だよ。'
          });
        }
      )
    );
  });

  it('party time', async () => {
    const fn = vi.fn(() => Promise.resolve());
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['party', 'time'], responder.schema),
        fn
      )
    );
    expect(fn).toHaveBeenCalledWith({
      title: '次のゲリラ参加時刻を42分にしたよ。'
    });
  });

  it('party specified time', async () => {
    const fn = vi.fn(() => Promise.resolve());
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['party', 'time', '36'], responder.schema),
        fn
      )
    );
    expect(fn).toHaveBeenCalledWith({
      title: '次のゲリラ参加時刻を36分にしたよ。'
    });
  });

  it('party enable but must cancel', async () => {
    const fn = vi.fn();
    const reply = vi.fn<[EmbedMessage]>(() => Promise.resolve({ edit: fn }));
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['party', 'enable'], responder.schema),
        reply,
        {
          senderVoiceChannelId: null
        }
      )
    );
    const nextTriggerMs = (random.minutes() + 1) * 60 * 1000;
    clock.placeholder = new Date(nextTriggerMs);
    scheduleRunner.consume();
    const oneHoursAgo = (random.minutes() + 61) * 60 * 1000;
    clock.placeholder = new Date(oneHoursAgo);
    scheduleRunner.consume();

    expect(reply).toHaveBeenNthCalledWith(1, {
      title: 'ゲリラを有効化しておいたよ。'
    });
    expect(reply).toHaveBeenNthCalledWith(2, {
      title: 'Party安全装置が作動したよ。',
      description:
        '起動した本人がボイスチャンネルに居ないのでキャンセルしておいた。悪く思わないでね。'
    });
    expect(reply).toHaveBeenCalledTimes(2);
    expect(fn).not.toHaveBeenCalled();
  });
});
