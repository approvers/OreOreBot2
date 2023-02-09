import type { Schema } from '../model/command-schema.js';
import type { CommandRunner } from '../runner/command.js';
import type { Clock, ScheduleRunner } from '../runner/schedule.js';
import { ChannelInfo, ChannelStatsRepository } from './command/channel-info.js';
import type { CommandResponder } from './command/command-message.js';
import { DebugCommand, MessageRepository } from './command/debug.js';
import { DiceCommand, DiceQueen } from './command/dice.js';
import { GuildInfo, GuildStatsRepository } from './command/guild-info.js';
import { GyokuonAssetKey, GyokuonCommand } from './command/gyokuon.js';
import { HelpCommand } from './command/help.js';
import { JudgingCommand, RandomGenerator } from './command/judging.js';
import {
  KaereCommand,
  KaereMusicKey,
  ReservationRepository,
  VoiceRoomController
} from './command/kaere.js';
import { KokuseiChousa, MemberStats } from './command/kokusei-chousa.js';
import { Meme } from './command/meme.js';
import {
  AssetKey,
  PartyCommand,
  RandomGenerator as PartyRng
} from './command/party.js';
import { Ping, PingCommand } from './command/ping.js';
import { RoleCreate, RoleCreateManager } from './command/role-create.js';
import { RoleInfo, RoleStatsRepository } from './command/role-info.js';
import { MembersWithRoleRepository, RoleRank } from './command/role-rank.js';
import { Sheriff, SheriffCommand } from './command/stfu.js';
import { TypoReporter, TypoRepository } from './command/typo-record.js';
import { UserInfo, UserStatsRepository } from './command/user-info.js';
import { GetVersionCommand, VersionFetcher } from './command/version.js';
import type { StandardOutput } from './output.js';
import type { VoiceConnectionFactory } from './voice-connection.js';

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
  fetcher,
  messageRepo,
  membersRepo,
  roleRepo,
  userRepo,
  guildRepo,
  roleCreateRepo,
  queen,
  stdout,
  channelManager
}: {
  typoRepo: TypoRepository;
  reservationRepo: ReservationRepository;
  factory: VoiceConnectionFactory<AssetKey | KaereMusicKey | GyokuonAssetKey>;
  clock: Clock;
  scheduleRunner: ScheduleRunner;
  random: PartyRng & RandomGenerator;
  roomController: VoiceRoomController;
  commandRunner: CommandRunner;
  stats: MemberStats;
  sheriff: Sheriff;
  ping: Ping;
  fetcher: VersionFetcher;
  messageRepo: MessageRepository;
  membersRepo: MembersWithRoleRepository;
  roleRepo: RoleStatsRepository;
  userRepo: UserStatsRepository;
  guildRepo: GuildStatsRepository;
  roleCreateRepo: RoleCreateManager;
  queen: DiceQueen;
  stdout: StandardOutput;
  channelManager: ChannelStatsRepository;
}) => {
  const allResponders = [
    new TypoReporter(typoRepo, clock, scheduleRunner),
    new PartyCommand({ factory, clock, scheduleRunner, random }),
    new KaereCommand({
      connectionFactory: factory,
      controller: roomController,
      clock,
      scheduleRunner,
      stdout,
      repo: reservationRepo
    }),
    new GyokuonCommand({
      connectionFactory: factory,
      controller: roomController
    }),
    new JudgingCommand(random),
    new Meme(),
    new HelpCommand(commandRunner),
    new KokuseiChousa(stats),
    new SheriffCommand(sheriff),
    new PingCommand(ping),
    new GetVersionCommand(fetcher),
    new DebugCommand(messageRepo),
    new RoleRank(membersRepo),
    new RoleInfo(roleRepo),
    new UserInfo(userRepo),
    new GuildInfo(guildRepo),
    new RoleCreate(roleCreateRepo),
    new DiceCommand(queen),
    new ChannelInfo(channelManager)
  ];
  for (const responder of allResponders) {
    commandRunner.addResponder(
      responder as unknown as CommandResponder<Schema>
    );
  }
};
