import {
  Clock,
  ScheduleRunner,
  composeMessageEventResponders,
  composeMessageUpdateEventResponders
} from '../runner';
import { DeletionObservable, DeletionRepeater } from './deletion-repeater';
import { DifferenceDetector } from './difference-detector';
import {
  KaereCommand,
  KaereMusicKey,
  ReservationRepository,
  VoiceRoomController
} from './kaere';
import { AssetKey, PartyCommand, RandomGenerator } from './party';
import {
  TypoObservable,
  TypoRecorder,
  TypoReporter,
  TypoRepository
} from './typo-record';
import type { VoiceConnectionFactory } from './voice-connection';

export const allMessageEventResponder = (repo: TypoRepository) =>
  composeMessageEventResponders<DeletionObservable & TypoObservable>(
    new DeletionRepeater(),
    new TypoRecorder(repo)
  );

export const allMessageUpdateEventResponder = () =>
  composeMessageUpdateEventResponders(new DifferenceDetector());

export const allCommandResponder = (
  typoRepo: TypoRepository,
  reservationRepo: ReservationRepository,
  factory: VoiceConnectionFactory<AssetKey | KaereMusicKey>,
  clock: Clock,
  scheduleRunner: ScheduleRunner,
  randomMinutes: RandomGenerator,
  roomController: VoiceRoomController
) =>
  composeMessageEventResponders(
    new TypoReporter(typoRepo, clock, scheduleRunner),
    new PartyCommand(factory, clock, scheduleRunner, randomMinutes),
    new KaereCommand(
      factory,
      roomController,
      clock,
      scheduleRunner,
      reservationRepo
    )
  );
