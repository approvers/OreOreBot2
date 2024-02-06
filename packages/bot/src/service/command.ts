import type { DepRegistry } from '../driver/dep-registry.js';
import type { Schema } from '../model/command-schema.js';
import type { CommandRunner } from '../runner/command.js';
import { ChannelInfo } from './command/channel-info.js';
import type { CommandResponderFor } from './command/command-message.js';
import { DebugCommand } from './command/debug.js';
import { DiceCommand } from './command/dice.js';
import { GuildInfo } from './command/guild-info.js';
import { GyokuonCommand } from './command/gyokuon.js';
import { HelpCommand } from './command/help.js';
import { JudgingCommand } from './command/judging.js';
import { KaereCommand } from './command/kaere.js';
import { KokuseiChousa } from './command/kokusei-chousa.js';
import { Meme } from './command/meme.js';
import { PartyCommand } from './command/party.js';
import { PingCommand } from './command/ping.js';
import { RoleCreate } from './command/role-create.js';
import { RoleInfo } from './command/role-info.js';
import { RoleRank } from './command/role-rank.js';
import { SheriffCommand } from './command/stfu.js';
import { TypoReporter } from './command/typo-record.js';
import { UserInfo } from './command/user-info.js';
import { GetVersionCommand } from './command/version.js';

export const registerAllCommandResponder = (
  commandRunner: CommandRunner,
  registry: DepRegistry
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
    new RoleRank(registry),
    new RoleInfo(registry),
    new UserInfo(registry),
    new GuildInfo(registry),
    new RoleCreate(registry),
    new DiceCommand(registry),
    new ChannelInfo(registry)
  ];
  for (const responder of allResponders) {
    commandRunner.addResponder(
      responder as unknown as CommandResponderFor<Schema>
    );
  }
};
