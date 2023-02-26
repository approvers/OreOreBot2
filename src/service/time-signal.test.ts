import { describe, expect, test, vi } from 'vitest';

import { MockClock } from '../adaptor/clock.js';
import { ScheduleRunner } from '../runner/schedule.js';
import type { StandardOutput } from './output.js';
import { SignalSchedule, startTimeSignal } from './time-signal.js';

describe('time signal reported', () => {
  const clock = new MockClock(new Date(0));
  const runner = new ScheduleRunner(clock);
  const output: StandardOutput = { sendEmbed: () => Promise.resolve() };
  test('at now', () => {
    const sendEmbed = vi.spyOn(output, 'sendEmbed');
    const schedule: SignalSchedule = {
      MORNING: {
        time: {
          hours: 8,
          minutes: 0
        },
        message: 'hoge'
      },
      NOON: {
        time: {
          hours: 12,
          minutes: 0
        },
        message: 'fuga'
      },
      MIDNIGHT: {
        time: {
          hours: 21,
          minutes: 0
        },
        message: 'foo'
      }
    };

    startTimeSignal({ runner, clock, schedule, output });
    clock.placeholder = new Date(8 * 60 * 60 * 1000);
    runner.consume();

    expect(sendEmbed).toHaveBeenCalledOnce();
    expect(sendEmbed).toHaveBeenCalledWith({
      title: 'はらちょ時報システム',
      description: 'hoge',
      footer: '1970-01-01 08:00:00 JST'
    });
  });
});
