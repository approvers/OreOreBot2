import {
  type AssetKey,
  PartyCommand,
  type RandomGenerator as PartyRng
} from './party.js';
import {
  type BoldItalicCop,
  BoldItalicCopReporter
} from './bold-italic-cop.js';
import {
  type Clock,
  type MessageResponseRunner,
  ScheduleRunner,
  composeEmojiEventResponders,
  composeMessageEventResponders,
  composeMessageUpdateEventResponders,
  composeRoleEventResponders
} from '../runner/index.js';
import type { CommandMessage, CommandResponder } from './command-message.js';
import {
  type DeletionObservable,
  DeletionRepeater
} from './deletion-repeater.js';
import { EmojiSeqObservable, EmojiSeqReact } from './emoji-seq-react.js';
import { GetVersionCommand, VersionFetcher } from './version.js';
import { JudgingCommand, type RandomGenerator } from './judging.js';
import {
  KaereCommand,
  type KaereMusicKey,
  type ReservationRepository,
  type VoiceRoomController
} from './kaere.js';
import { KawaemonHasAllRoles, RoleManager } from './kawaemon-has-all-roles.js';
import { KokuseiChousa, MemberStats } from './kokusei-chousa.js';
import { Ping, PingCommand } from './ping.js';
import { Sheriff, SheriffCommand } from './stfu.js';
import {
  type TypoObservable,
  TypoRecorder,
  TypoReporter,
  type TypoRepository
} from './typo-record.js';
import { DifferenceDetector } from './difference-detector.js';
import { EmojiLog } from './emoji-log.js';
import { HelpCommand } from './help.js';
import { Meme } from './meme.js';
import type { Snowflake } from '../model/id.js';
import type { StandardOutput } from './output.js';
import type { VoiceConnectionFactory } from './voice-connection.js';

export const allMessageEventResponder = (repo: TypoRepository) =>
  composeMessageEventResponders<
    DeletionObservable & TypoObservable & BoldItalicCop & EmojiSeqObservable
  >(
    new DeletionRepeater(),
    new TypoRecorder(repo),
    new BoldItalicCopReporter(),
    new EmojiSeqReact()
  );

export const allMessageUpdateEventResponder = () =>
  composeMessageUpdateEventResponders(new DifferenceDetector());

export const registerAllCommandResponder = ({
  typoRepo,
  reservationRepo,
  factory,
  clock,
  scheduleRunner,
  random,
  roomController,
  commandRunner,
  stats,
  sheriff,
  ping,
  fetcher
}: {
  typoRepo: TypoRepository;
  reservationRepo: ReservationRepository;
  factory: VoiceConnectionFactory<AssetKey | KaereMusicKey>;
  clock: Clock;
  scheduleRunner: ScheduleRunner;
  random: PartyRng & RandomGenerator;
  roomController: VoiceRoomController;
  commandRunner: MessageResponseRunner<CommandMessage, CommandResponder>;
  stats: MemberStats;
  sheriff: Sheriff;
  ping: Ping;
  fetcher: VersionFetcher;
}) => {
  const allResponders = [
    new TypoReporter(typoRepo, clock, scheduleRunner),
    new PartyCommand({ factory, clock, scheduleRunner, random }),
    new KaereCommand({
      connectionFactory: factory,
      controller: roomController,
      clock,
      scheduleRunner,
      repo: reservationRepo
    }),
    new JudgingCommand(random),
    new Meme(),
    new HelpCommand(commandRunner),
    new KokuseiChousa(stats),
    new SheriffCommand(sheriff),
    new PingCommand(ping),
    new GetVersionCommand(fetcher)
  ];
  for (const responder of allResponders) {
    commandRunner.addResponder(responder);
  }
};

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
