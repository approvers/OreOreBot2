import {
  Clock,
  ScheduleRunner,
  composeMessageEventResponders,
  composeMessageUpdateEventResponders
} from '../runner';
import { DeletionObservable, DeletionRepeater } from './deletion-repeater';
import { DifferenceDetector } from './difference-detector';
import {
  TypoObservable,
  TypoRecorder,
  TypoReporter,
  TypoRepository
} from './typo-record';

export const allMessageEventResponder = (repo: TypoRepository) =>
  composeMessageEventResponders<DeletionObservable & TypoObservable>(
    new DeletionRepeater(),
    new TypoRecorder(repo)
  );

export const allMessageUpdateEventResponder = () =>
  composeMessageUpdateEventResponders(new DifferenceDetector());

export const allCommandResponder = (
  repo: TypoRepository,
  clock: Clock,
  scheduleRunner: ScheduleRunner
) =>
  composeMessageEventResponders(new TypoReporter(repo, clock, scheduleRunner));
