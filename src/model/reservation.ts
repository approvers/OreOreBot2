import { nanoid } from 'nanoid';
import type { Snowflake } from './id';

declare const reservationIdNominal: unique symbol;
export type ReservationId = string & { [reservationIdNominal]: never };

const hoursMinutesRegex = /^(\d\d?):(\d\d?)$/;

export class ReservationTime {
  constructor(public readonly hours: number, public readonly minutes: number) {
    if (!(0 <= hours && hours < 24 && 0 <= minutes && minutes < 60)) {
      throw new RangeError('hours or minutes got out of range');
    }
  }

  static fromHoursMinutes(hoursMinutes: string): ReservationTime | null {
    const result = hoursMinutesRegex.exec(hoursMinutes);
    if (!result) {
      return null;
    }
    const [hours, minutes] = [result[1], result[2]].map((str) =>
      parseInt(str, 10)
    );
    if (!(0 <= hours && hours < 24 && 0 <= minutes && minutes < 60)) {
      return null;
    }
    return new ReservationTime(hours, minutes);
  }
}

const hasOwnProperty = <K extends PropertyKey>(
  obj: object,
  prop: K
): obj is Record<K, unknown> => Object.prototype.hasOwnProperty.call(obj, prop);

const isObject = (x: unknown): x is object =>
  typeof x === 'object' && x !== null;

export class Reservation {
  constructor(
    public readonly id: ReservationId,
    public readonly time: ReservationTime,
    public readonly guildId: Snowflake,
    public readonly voiceRoomId: Snowflake
  ) {}

  static new(
    time: ReservationTime,
    guildId: Snowflake,
    voiceRoomId: Snowflake
  ): Reservation {
    return new Reservation(
      nanoid() as ReservationId,
      time,
      guildId,
      voiceRoomId
    );
  }

  static deserialize(json: string): Reservation | null {
    const data = JSON.parse(json) as unknown;
    if (!isObject(data)) {
      return null;
    }
    if (!(hasOwnProperty(data, 'id') && typeof data.id === 'string')) {
      return null;
    }
    if (!(hasOwnProperty(data, 'time') && isObject(data.time))) {
      return null;
    }
    if (
      !(
        hasOwnProperty(data.time, 'hours') &&
        typeof data.time.hours === 'number'
      )
    ) {
      return null;
    }
    if (
      !(
        hasOwnProperty(data.time, 'minutes') &&
        typeof data.time.minutes === 'number'
      )
    ) {
      return null;
    }
    if (
      !(hasOwnProperty(data, 'guildId') && typeof data.guildId === 'string')
    ) {
      return null;
    }
    if (
      !(
        hasOwnProperty(data, 'voiceRoomId') &&
        typeof data.voiceRoomId === 'string'
      )
    ) {
      return null;
    }
    return new Reservation(
      data.id as ReservationId,
      new ReservationTime(data.time.hours, data.time.minutes),
      data.guildId as Snowflake,
      data.voiceRoomId as Snowflake
    );
  }

  serialize(): string {
    return JSON.stringify(this);
  }
}
