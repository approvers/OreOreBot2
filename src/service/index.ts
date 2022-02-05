import {
  Clock,
  ScheduleRunner,
  composeMessageEventResponders,
  composeMessageUpdateEventResponders
} from '../runner';
import { DeletionObservable, DeletionRepeater } from './deletion-repeater';
import { DifferenceDetector } from './difference-detector';
import { AssetKey, PartyCommand, RandomMinutes } from './party';
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
  repo: TypoRepository,
  factory: VoiceConnectionFactory<AssetKey>,
  clock: Clock,
  scheduleRunner: ScheduleRunner,
  randomMinutes: RandomMinutes
) =>
  composeMessageEventResponders(
    new TypoReporter(repo, clock, scheduleRunner),
    new PartyCommand(factory, clock, scheduleRunner, randomMinutes)
  );
