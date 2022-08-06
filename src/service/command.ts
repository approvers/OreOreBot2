import {
  AssetKey,
  PartyCommand,
  RandomGenerator as PartyRng
} from './command/party.js';
import { Clock, ScheduleRunner } from '../runner/schedule.js';
import { CommandMessage, CommandResponder } from './command/command-message.js';
import { DebugCommand, MessageRepository } from './command/debug.js';
import { GetVersionCommand, VersionFetcher } from './command/version.js';
import { JudgingCommand, RandomGenerator } from './command/judging.js';
import {
  KaereCommand,
  KaereMusicKey,
  ReservationRepository,
  VoiceRoomController
} from './command/kaere.js';
import { KokuseiChousa, MemberStats } from './command/kokusei-chousa.js';
import { MembersWithRoleRepository, RoleRank } from './command/role-rank.js';
import { Ping, PingCommand } from './command/ping.js';
import { RoleInfo, RoleStatsRepository } from './command/role-info.js';
import { Sheriff, SheriffCommand } from './command/stfu.js';
import { TypoReporter, TypoRepository } from './command/typo-record.js';
import { UserInfo, UserStatsRepository } from './command/user-info.js';
import { HelpCommand } from './command/help.js';
import { Meme } from './command/meme.js';
import { MessageResponseRunner } from '../runner/message.js';
import { VoiceConnectionFactory } from './voice-connection.js';

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
  userRepo
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
  messageRepo: MessageRepository;
  membersRepo: MembersWithRoleRepository;
  roleRepo: RoleStatsRepository;
  userRepo: UserStatsRepository;
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
    new GetVersionCommand(fetcher),
    new DebugCommand(messageRepo),
    new RoleRank(membersRepo),
    new RoleInfo(roleRepo),
    new UserInfo(userRepo)
  ];
  for (const responder of allResponders) {
    commandRunner.addResponder(responder);
  }
};
