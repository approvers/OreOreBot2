import { addDays, isBefore, setHours, setMinutes } from 'date-fns';
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';
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

export interface SignalTime {
  hours: number;
  minutes: number;
}

const intoDate = ({ hours, minutes }: SignalTime, clock: Clock): Date => {
  const now = utcToZonedTime(clock.now().getUTCDate(), 'Asia/Tokyo');
  let hasHoursMinutes = setHours(setMinutes(now, minutes), hours);
  if (isBefore(now, hasHoursMinutes)) {
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
      footer: formatInTimeZone(
        clock.now().getUTCDay(),
        'Asia/Tokyo',
        'yyyy-MM-dd HH:mm:ss zzz'
      )
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
    runner.runOnNextTime(
      `TIME_SIGNAL_${messageType}`,
      reportTimeSignal({ signalMessage, clock, output }),
      intoDate(signalMessage.time, clock)
    );
  }
};
