import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';

import { messageTypes, SignalSchedule } from '../service/time-signal.js';

const messageFields = ['time', 'message'] as const;
const timeFields = ['hours', 'minutes'] as const;

const validate = (object: unknown): object is SignalSchedule => {
  if (!(typeof object === 'object' && object !== null)) {
    return false;
  }
  for (const key of messageTypes) {
    if (!Object.hasOwn(object, key)) {
      return false;
    }
    const entryUnsafe = (object as Record<typeof key, unknown>)[key];
    if (!(typeof entryUnsafe === 'object' && entryUnsafe !== null)) {
      return false;
    }
    for (const field of messageFields) {
      if (!Object.hasOwn(entryUnsafe, field)) {
        return false;
      }
    }
    const { time: timeUnsafe, message } = entryUnsafe as Record<
      (typeof messageFields)[number],
      unknown
    >;
    if (!(typeof message === 'string' && 0 < message.length)) {
      return false;
    }
    if (!(typeof timeUnsafe === 'object' && timeUnsafe !== null)) {
      return false;
    }
    const { hours, minutes } = timeUnsafe as Record<
      (typeof timeFields)[number],
      unknown
    >;
    if (
      !(
        typeof hours === 'number' &&
        Number.isInteger(hours) &&
        0 <= hours &&
        hours < 24
      )
    ) {
      return false;
    }
    if (
      !(
        typeof minutes === 'number' &&
        Number.isInteger(minutes) &&
        0 <= minutes &&
        minutes < 60
      )
    ) {
      return false;
    }
  }
  return true;
};

export const loadSchedule = (path: string[]): SignalSchedule => {
  const fileText = readFileSync(join(...path), {
    encoding: 'utf-8',
    flag: 'r'
  });
  const parsed = parse(fileText) as unknown;
  if (!validate(parsed)) {
    console.error(parsed);
    throw new Error('invalid signal schedule');
  }
  return parsed;
};
