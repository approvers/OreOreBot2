import type { DepRegistry } from '../driver/dep-registry.js';
import type { Schema } from '../model/command-schema.js';
import type { CommandRunner } from '../runner/command.js';
import {
  ChannelInfo,
  type ChannelStatsRepository
} from './command/channel-info.js';
import type { CommandResponderFor } from './command/command-message.js';
import { DebugCommand } from './command/debug.js';
import { DiceCommand, type DiceQueen } from './command/dice.js';
import { GuildInfo, type GuildStatsRepository } from './command/guild-info.js';
import { GyokuonCommand } from './command/gyokuon.js';
import { HelpCommand } from './command/help.js';
import { JudgingCommand } from './command/judging.js';
import { KaereCommand } from './command/kaere.js';
import { KokuseiChousa } from './command/kokusei-chousa.js';
import { Meme } from './command/meme.js';
import { PartyCommand } from './command/party.js';
import { PingCommand } from './command/ping.js';
import { RoleCreate, type RoleCreateManager } from './command/role-create.js';
import { RoleInfo, type RoleStatsRepository } from './command/role-info.js';
import {
  type MembersWithRoleRepository,
  RoleRank
} from './command/role-rank.js';
import { SheriffCommand } from './command/stfu.js';
import { TypoReporter } from './command/typo-record.js';
import { UserInfo, type UserStatsRepository } from './command/user-info.js';
import { GetVersionCommand } from './command/version.js';

export const registerAllCommandResponder = (
  commandRunner: CommandRunner,
  {
    membersRepo,
    roleRepo,
    userRepo,
    guildRepo,
    roleCreateRepo,
    queen,
    channelRepository,
    registry
  }: {
    membersRepo: MembersWithRoleRepository;
    roleRepo: RoleStatsRepository;
    userRepo: UserStatsRepository;
    guildRepo: GuildStatsRepository;
    roleCreateRepo: RoleCreateManager;
    queen: DiceQueen;
    channelRepository: ChannelStatsRepository;
    registry: DepRegistry;
  }
) => {
  const allResponders = [
    new TypoReporter(registry),
    new PartyCommand(registry),
    new KaereCommand(registry),
    new GyokuonCommand(registry),
    new JudgingCommand(registry),
    new Meme(),
    new HelpCommand(registry),
    new KokuseiChousa(registry),
    new SheriffCommand(registry),
    new PingCommand(registry),
    new GetVersionCommand(registry),
    new DebugCommand(registry),
    new RoleRank(membersRepo),
    new RoleInfo(roleRepo),
    new UserInfo(userRepo),
    new GuildInfo(guildRepo),
    new RoleCreate(roleCreateRepo),
    new DiceCommand(queen),
    new ChannelInfo(channelRepository)
  ];
  for (const responder of allResponders) {
    commandRunner.addResponder(
      responder as unknown as CommandResponderFor<Schema>
    );
  }
};
