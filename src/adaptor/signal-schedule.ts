import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';

import { messageTypes, SignalSchedule } from '../service/time-signal.js';

const fields = ['hours', 'minutes', 'message'] as const;

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
    for (const field of fields) {
      if (!Object.hasOwn(entryUnsafe, field)) {
        return false;
      }
    }
    const { hours, minutes, message } = entryUnsafe as Record<
      (typeof fields)[number],
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
    if (!(typeof message === 'string' && 0 < message.length)) {
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
  console.dir(parsed);
  if (!validate(parsed)) {
    console.error(parsed);
    throw new Error('invalid signal schedule');
  }
  return parsed;
};
