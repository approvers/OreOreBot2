import { describe, expect, test, vi } from 'vitest';

import { MockClock } from '../adaptor/clock.js';
import { ScheduleRunner } from '../runner/schedule.js';
import type { StandardOutput } from './output.js';
import { type SignalSchedule, startTimeSignal } from './time-signal.js';

describe('time signal reported', () => {
  const clock = new MockClock(new Date(Date.UTC(2020, 0, 1, 0, 0)));
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
    clock.placeholder = new Date(Date.UTC(2020, 0, 1, 3, 1));
    runner.consume();

    expect(sendEmbed).toHaveBeenCalledOnce();
    expect(sendEmbed).toHaveBeenCalledWith({
      title: 'はらちょ時報システム',
      description: 'fuga',
      footer: '2020/01/01 12:01:00 JST'
    });
  });
});
