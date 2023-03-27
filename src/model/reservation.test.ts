import { expect, it } from 'vitest';

import type { Snowflake } from './id.js';
import {
  Reservation,
  type ReservationId,
  ReservationTime
} from './reservation.js';

it('invalid time construction', () => {
  expect(() => new ReservationTime(-1, 0)).toThrow(
    'hours or minutes got out of range'
  );
  expect(() => new ReservationTime(24, 0)).toThrow(
    'hours or minutes got out of range'
  );
  expect(() => new ReservationTime(0, -1)).toThrow(
    'hours or minutes got out of range'
  );
  expect(() => new ReservationTime(0, 60)).toThrow(
    'hours or minutes got out of range'
  );
});

it('time from invalid hours minutes', () => {
  expect(ReservationTime.fromHoursMinutes('0:')).toBeNull();
  expect(ReservationTime.fromHoursMinutes(':0')).toBeNull();
  expect(ReservationTime.fromHoursMinutes('24:00')).toBeNull();
  expect(ReservationTime.fromHoursMinutes('10:60')).toBeNull();
});

it('time into Japanese', () => {
  expect(new ReservationTime(11, 59).intoJapanese()).toStrictEqual(
    '午前11時59分'
  );
  expect(new ReservationTime(12, 0).intoJapanese()).toStrictEqual('午後0時0分');
});

it('serialize reservation', () => {
  const reservation = new Reservation({
    id: '0000' as ReservationId,
    time: new ReservationTime(6, 0),
    guildId: '1234' as Snowflake,
    voiceRoomId: '3456' as Snowflake
  });
  expect(reservation.serialize()).toStrictEqual(
    '{"id":"0000","time":{"hours":6,"minutes":0},"guildId":"1234","voiceRoomId":"3456"}'
  );
});

it('deserialize reservation', () => {
  expect(Reservation.deserialize('0')).toBeNull();
  expect(Reservation.deserialize('[]')).toBeNull();
  expect(
    Reservation.deserialize(
      '{"time":{"hours":6,"minutes":0},"guildId":"1234","voiceRoomId":"3456"}'
    )
  ).toBeNull();
  expect(
    Reservation.deserialize(
      '{"id":"0000","guildId":"1234","voiceRoomId":"3456"}'
    )
  ).toBeNull();
  expect(
    Reservation.deserialize(
      '{"id":"0000","time":{"minutes":0},"guildId":"1234","voiceRoomId":"3456"}'
    )
  ).toBeNull();
  expect(
    Reservation.deserialize(
      '{"id":"0000","time":{"hours":6},"guildId":"1234","voiceRoomId":"3456"}'
    )
  ).toBeNull();
  expect(
    Reservation.deserialize(
      '{"id":"0000","time":{"hours":6,"minutes":0},"voiceRoomId":"3456"}'
    )
  ).toBeNull();
  expect(
    Reservation.deserialize(
      '{"id":"0000","time":{"hours":6,"minutes":0},"guildId":"1234"}'
    )
  ).toBeNull();

  expect(
    Reservation.deserialize(
      '{"id":"0000","time":{"hours":6,"minutes":0},"guildId":"1234","voiceRoomId":"3456"}'
    )
  ).toStrictEqual(
    new Reservation({
      id: '0000' as ReservationId,
      time: new ReservationTime(6, 0),
      guildId: '1234' as Snowflake,
      voiceRoomId: '3456' as Snowflake
    })
  );
});
