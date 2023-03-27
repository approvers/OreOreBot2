import type { Snowflake } from '../model/id.js';
import {
  composeEmojiEventResponders,
  composeMessageEventResponders,
  composeMessageUpdateEventResponders,
  composeRoleEventResponders
} from '../runner/index.js';
import {
  type BoldItalicCop,
  BoldItalicCopReporter
} from './bold-italic-cop.js';
import {
  type TypoObservable,
  TypoRecorder,
  type TypoRepository
} from './command/typo-record.js';
import {
  type DeletionObservable,
  DeletionRepeater
} from './deletion-repeater.js';
import { DifferenceDetector } from './difference-detector.js';
import { EmojiLog } from './emoji-log.js';
import { type EmojiSeqObservable, EmojiSeqReact } from './emoji-seq-react.js';
import {
  KawaemonHasAllRoles,
  type RoleManager
} from './kawaemon-has-all-roles.js';
import type { StandardOutput } from './output.js';

const stfuIgnorePredicate = (content: string): boolean => content === '!stfu';

export const allMessageEventResponder = (
  repo: TypoRepository,
  sequencesYaml: string
) =>
  composeMessageEventResponders<
    DeletionObservable & TypoObservable & BoldItalicCop & EmojiSeqObservable
  >(
    new DeletionRepeater(stfuIgnorePredicate),
    new TypoRecorder(repo),
    new BoldItalicCopReporter(),
    new EmojiSeqReact(sequencesYaml)
  );

export const allMessageUpdateEventResponder = () =>
  composeMessageUpdateEventResponders(new DifferenceDetector());

export { registerAllCommandResponder } from './command.js';

export const allRoleResponder = ({
  kawaemonId,
  roleManager,
  output
}: {
  kawaemonId: Snowflake;
  roleManager: RoleManager;
  output: StandardOutput;
}) =>
  composeRoleEventResponders(
    new KawaemonHasAllRoles(kawaemonId, roleManager, output)
  );

export const allEmojiResponder = (output: StandardOutput) =>
  composeEmojiEventResponders(new EmojiLog(output));
