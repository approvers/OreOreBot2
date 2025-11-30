import type { Client } from 'discord.js';

import type { Snowflake } from '../../model/id.js';
import type {
  Command,
  CommandRepository,
  RegisteredCommand
} from '../../service/command/register.js';

export class DiscordCommandRepository implements CommandRepository {
  constructor(private readonly client: Client) {}
  async currentCommands(): Promise<RegisteredCommand[]> {
    const commands = await this.client.application?.commands.fetch();
    return (commands ?? []) as RegisteredCommand[];
  }
  async setCommands(command: Command[]): Promise<void> {
    await this.client.application?.commands.set(command);
  }
  async updateCommand(command: RegisteredCommand): Promise<void> {
    await this.client.application?.commands.edit(command.id, command);
  }
  async deleteCommand(id: Snowflake): Promise<void> {
    await this.client.application?.commands.delete(id);
  }
}
