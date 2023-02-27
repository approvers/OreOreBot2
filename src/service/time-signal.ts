import { addDays, format, setHours, setMinutes } from 'date-fns';
// eslint-disable-next-line import/order
import { setTimeout } from 'timers/promises';

import type {
  Clock,
  ScheduleRunner,
  ScheduleTask
} from '../runner/schedule.js';
import type { StandardOutput } from './output.js';

export const messageTypes = ['MORNING', 'NOON', 'MIDNIGHT'] as const;

export type SignalMessageType = (typeof messageTypes)[number];

/**
 * 時報を送る時分を Asia/Tokyo のタイムゾーンで表す。
 */
export interface SignalTime {
  hours: number;
  minutes: number;
}

const intoDate = ({ hours, minutes }: SignalTime, clock: Clock): Date => {
  const now = clock.now();
  let hasHoursMinutes = new Date(now);
  hasHoursMinutes = setHours(hasHoursMinutes, hours);
  hasHoursMinutes = setMinutes(hasHoursMinutes, minutes);
  if (hasHoursMinutes.getTime() < now.getTime()) {
    hasHoursMinutes = addDays(hasHoursMinutes, 1);
  }
  return hasHoursMinutes;
};

export interface SignalMessage {
  time: SignalTime;
  message: string;
}

export type SignalSchedule = Record<SignalMessageType, SignalMessage>;

const reportTimeSignal =
  ({
    signalMessage,
    clock,
    output
  }: {
    signalMessage: SignalMessage;
    clock: Clock;
    output: StandardOutput;
  }): ScheduleTask =>
  async (): Promise<Date> => {
    await output.sendEmbed({
      title: 'はらちょ時報システム',
      description: signalMessage.message,
      footer: format(clock.now(), 'yyyy-MM-dd HH:mm:ss')
    });
    await setTimeout(60 * 1000);
    return intoDate(signalMessage.time, clock);
  };

export const startTimeSignal = ({
  runner,
  clock,
  schedule,
  output
}: {
  runner: ScheduleRunner;
  clock: Clock;
  schedule: SignalSchedule;
  output: StandardOutput;
}) => {
  for (const messageType of messageTypes) {
    const signalMessage = schedule[messageType];
    const reportTask = reportTimeSignal({ signalMessage, clock, output });
    const firstSignalDate = intoDate(signalMessage.time, clock);
    runner.runOnNextTime(
      `TIME_SIGNAL_${messageType}`,
      reportTask,
      firstSignalDate
    );
  }
};
