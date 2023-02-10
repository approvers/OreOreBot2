import { nanoid } from 'nanoid';

import type { Snowflake } from './id.js';

declare const reservationIdNominal: unique symbol;
/**
 * 予約モデル `Reservation` どうしを識別する ID 文字列。
 */
export type ReservationId = string & { [reservationIdNominal]: never };

const hoursMinutesRegex = /^(\d\d?):(\d\d?)$/;

/**
 * 予約の時刻を表すバリューオブジェクト。
 */
export class ReservationTime {
  constructor(public readonly hours: number, public readonly minutes: number) {
    if (!(0 <= hours && hours < 24 && 0 <= minutes && minutes < 60)) {
      throw new RangeError('hours or minutes got out of range');
    }
  }

  /**
   * `HH:MM` 形式の文字列をパースして `ReservationTime` を作成する。
   *
   * @param hoursMinutes - `HH:MM` 形式の文字列
   * @returns パースした結果の `ReservationTime`、失敗した場合は null
   */
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

  /**
   * 時刻を日本語の形式の文字列に変換する。
   *
   * @returns `午前{HH}時{MM}分` または `午後{HH}時{MM}分` の形式の文字列。`HH` は 0 以上 12 未満になる。
   */
  intoJapanese(): `午前${string}時${string}分` | `午後${string}時${string}分` {
    if (this.hours < 12) {
      return `午前${this.hours}時${this.minutes}分`;
    } else {
      return `午後${this.hours - 12}時${this.minutes}分`;
    }
  }
}

const hasOwnProperty = <K extends PropertyKey>(
  obj: object,
  prop: K
): obj is Record<K, unknown> => Object.prototype.hasOwnProperty.call(obj, prop);

const isObject = (x: unknown): x is object =>
  typeof x === 'object' && x !== null;

/**
 * 特定のボイスチャンネルへ参加する予約を表すモデル。
 */
export class Reservation {
  readonly id: ReservationId;
  readonly time: ReservationTime;
  readonly guildId: Snowflake;
  readonly voiceRoomId: Snowflake;

  constructor({
    id,
    time,
    guildId,
    voiceRoomId
  }: {
    id: ReservationId;
    time: ReservationTime;
    guildId: Snowflake;
    voiceRoomId: Snowflake;
  }) {
    this.id = id;
    this.time = time;
    this.guildId = guildId;
    this.voiceRoomId = voiceRoomId;
  }

  static new(
    time: ReservationTime,
    guildId: Snowflake,
    voiceRoomId: Snowflake
  ): Reservation {
    return new Reservation({
      id: nanoid() as ReservationId,
      time,
      guildId,
      voiceRoomId
    });
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
    return new Reservation({
      id: data.id as ReservationId,
      time: new ReservationTime(data.time.hours, data.time.minutes),
      guildId: data.guildId as Snowflake,
      voiceRoomId: data.voiceRoomId as Snowflake
    });
  }

  serialize(): string {
    return JSON.stringify(this);
  }
}
