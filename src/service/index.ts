import {
  type AssetKey,
  PartyCommand,
  type RandomGenerator as PartyRng
} from './party';
import { type BoldItalicCop, BoldItalicCopReporter } from './bold-italic-cop';
import {
  type Clock,
  type MessageResponseRunner,
  ScheduleRunner,
  composeEmojiEventResponders,
  composeMessageEventResponders,
  composeMessageUpdateEventResponders,
  composeRoleEventResponders
} from '../runner';
import type { CommandMessage, CommandResponder } from './command-message';
import { type DeletionObservable, DeletionRepeater } from './deletion-repeater';
import { JudgementCommand, type RandomGenerator } from './judgement';
import {
  KaereCommand,
  type KaereMusicKey,
  type ReservationRepository,
  type VoiceRoomController
} from './kaere';
import { KawaemonHasAllRoles, RoleManager } from './kawaemon-has-all-roles';
import { KokuseiChousa, MemberStats } from './kokusei-chousa';
import { Sheriff, SheriffCommand } from './stfu';
import {
  type TypoObservable,
  TypoRecorder,
  TypoReporter,
  type TypoRepository
} from './typo-record';
import { DifferenceDetector } from './difference-detector';
import { EmojiLog } from './emoji-log';
import { HelpCommand } from './help';
import { Meme } from './meme';
import type { Snowflake } from '../model/id';
import type { StandardOutput } from './output';
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

export const registerAllCommandResponder = (
  typoRepo: TypoRepository,
  reservationRepo: ReservationRepository,
  factory: VoiceConnectionFactory<AssetKey | KaereMusicKey>,
  clock: Clock,
  scheduleRunner: ScheduleRunner,
  random: PartyRng & RandomGenerator,
  roomController: VoiceRoomController,
  commandRunner: MessageResponseRunner<CommandMessage, CommandResponder>,
  stats: MemberStats,
  sheriff: Sheriff
) => {
  const allResponders = [
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
    new Meme(),
    new HelpCommand(commandRunner),
    new KokuseiChousa(stats),
    new SheriffCommand(sheriff)
  ];
  for (const responder of allResponders) {
    commandRunner.addResponder(responder);
  }
};

export const allRoleResponder = (
  kawaemonId: Snowflake,
  roleManager: RoleManager,
  output: StandardOutput
) =>
  composeRoleEventResponders(
    new KawaemonHasAllRoles(kawaemonId, roleManager, output)
  );

export const allEmojiResponder = (output: StandardOutput) =>
  composeEmojiEventResponders(new EmojiLog(output));
