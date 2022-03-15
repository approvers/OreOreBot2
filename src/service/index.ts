import {
  type AssetKey,
  PartyCommand,
  type RandomGenerator as PartyRng
} from './party';
import { type BoldItalicCop, BoldItalicCopReporter } from './bold-italic-cop';
import {
  type Clock,
  ScheduleRunner,
  composeMessageEventResponders,
  composeMessageUpdateEventResponders
} from '../runner';
import { type DeletionObservable, DeletionRepeater } from './deletion-repeater';
import { JudgementCommand, type RandomGenerator } from './judgement';
import {
  KaereCommand,
  type KaereMusicKey,
  type ReservationRepository,
  type VoiceRoomController
} from './kaere';
import {
  type TypoObservable,
  TypoRecorder,
  TypoReporter,
  type TypoRepository
} from './typo-record';
import { DifferenceDetector } from './difference-detector';
import { Hukueki } from './hukueki';
import type { VoiceConnectionFactory } from './voice-connection';

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
    new JudgementCommand(random),
    new Hukueki()
  );
