import type { Snowflake } from '../model/id.js';
import {
  composeEmojiEventResponders,
  composeMessageEventResponders,
  composeMessageUpdateEventResponders,
  composeRoleEventResponders
} from '../runner/index.js';
import { composeMemberEventResponders } from '../runner/member.js';
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
  DeletionRepeater,
  type GetNow
} from './deletion-repeater.js';
import { DifferenceDetector } from './difference-detector.js';
import { EmojiLog } from './emoji-log.js';
import { type EmojiSeqObservable, EmojiSeqReact } from './emoji-seq-react.js';
import {
  KawaemonHasAllRoles,
  type RoleManager
} from './kawaemon-has-all-roles.js';
import type { EntranceOutput, StandardOutput } from './output.js';
import { WelcomeMessage } from './welcome-message.js';

const stfuIgnorePredicate = (content: string): boolean => content === '!stfu';

export const allMessageEventResponder = (
  repo: TypoRepository,
  sequencesYaml: string,
  getNow: GetNow
) =>
  composeMessageEventResponders<
    DeletionObservable & TypoObservable & BoldItalicCop & EmojiSeqObservable
  >(
    new DeletionRepeater(stfuIgnorePredicate, getNow),
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

export const allMemberResponder = (output: EntranceOutput) =>
  composeMemberEventResponders(new WelcomeMessage(output));
