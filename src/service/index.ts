import {
  Clock,
  ScheduleRunner,
  composeMessageEventResponders,
  composeMessageUpdateEventResponders
} from '../runner';
import { DeletionObservable, DeletionRepeater } from './deletion-repeater';
import { DifferenceDetector } from './difference-detector';
import { JudgementCommand, RandomGenerator } from './judgement';
import {
  KaereCommand,
  KaereMusicKey,
  ReservationRepository,
  VoiceRoomController
} from './kaere';
import { AssetKey, PartyCommand, RandomGenerator as PartyRng } from './party';
import {
  TypoObservable,
  TypoRecorder,
  TypoReporter,
  TypoRepository
} from './typo-record';
import type { VoiceConnectionFactory } from './voice-connection';
import { BoldItalicCop, BoldItalicCopReporter } from './bold-italic-cop';

export const allMessageEventResponder = (repo: TypoRepository) =>
  composeMessageEventResponders<
    DeletionObservable & TypoObservable & BoldItalicCop
  >(
    new DeletionRepeater(),
    new TypoRecorder(repo),
    new BoldItalicCopReporter()
  );

export const allMessageUpdateEventResponder = () =>
  composeMessageUpdateEventResponders(new DifferenceDetector());

export const allCommandResponder = (
  typoRepo: TypoRepository,
  reservationRepo: ReservationRepository,
  factory: VoiceConnectionFactory<AssetKey | KaereMusicKey>,
  clock: Clock,
  scheduleRunner: ScheduleRunner,
  random: PartyRng & RandomGenerator,
  roomController: VoiceRoomController
) =>
  composeMessageEventResponders(
    new TypoReporter(typoRepo, clock, scheduleRunner),
    new PartyCommand(factory, clock, scheduleRunner, random),
    new KaereCommand(
      factory,
      roomController,
      clock,
      scheduleRunner,
      reservationRepo
    ),
    new JudgementCommand(random)
  );
