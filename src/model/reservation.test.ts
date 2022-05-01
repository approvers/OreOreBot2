import { Reservation, ReservationId, ReservationTime } from './reservation';
import type { Snowflake } from './id';

test('invalid time construction', () => {
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

test('time from invalid hours minutes', () => {
  expect(ReservationTime.fromHoursMinutes('0:')).toBeNull();
  expect(ReservationTime.fromHoursMinutes(':0')).toBeNull();
  expect(ReservationTime.fromHoursMinutes('24:00')).toBeNull();
  expect(ReservationTime.fromHoursMinutes('10:60')).toBeNull();
});

test('time into Japanese', () => {
  expect(new ReservationTime(11, 59).intoJapanese()).toStrictEqual(
    '午前11時59分'
  );
  expect(new ReservationTime(12, 0).intoJapanese()).toStrictEqual('午後0時0分');
});

test('serialize reservation', () => {
  const reservation = new Reservation(
    '0000' as ReservationId,
    new ReservationTime(6, 0),
    '1234' as Snowflake,
    '3456' as Snowflake
  );
  expect(reservation.serialize()).toStrictEqual(
    '{"id":"0000","time":{"hours":6,"minutes":0},"guildId":"1234","voiceRoomId":"3456"}'
  );
});

test('deserialize reservation', () => {
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
    new Reservation(
      '0000' as ReservationId,
      new ReservationTime(6, 0),
      '1234' as Snowflake,
      '3456' as Snowflake
    )
  );
});
