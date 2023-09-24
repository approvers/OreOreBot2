import { REST, Routes } from 'discord.js';

import type { Snowflake } from '../../model/id.js';
import type {
  Command,
  CommandRepository,
  RegisteredCommand
} from '../../service/command/register.js';

export class DiscordCommandRepository implements CommandRepository {
  constructor(
    private readonly rest: REST,
    private readonly APPLICATION_ID: string,
    private readonly GUILD_ID: string
  ) {}

  async currentCommands(): Promise<RegisteredCommand[]> {
    return (await this.rest.get(
      Routes.applicationGuildCommands(this.APPLICATION_ID, this.GUILD_ID)
    )) as RegisteredCommand[];
  }
  async createCommand(command: Command): Promise<void> {
    await this.rest.post(
      Routes.applicationGuildCommands(this.APPLICATION_ID, this.GUILD_ID),
      {
        body: command
      }
    );
  }
  async updateCommand(command: RegisteredCommand): Promise<void> {
    await this.rest.patch(
      Routes.applicationGuildCommand(
        this.APPLICATION_ID,
        this.GUILD_ID,
        command.id
      ),
      {
        body: command
      }
    );
  }
  async deleteCommand(id: Snowflake): Promise<void> {
    await this.rest.delete(
      Routes.applicationGuildCommand(this.APPLICATION_ID, this.GUILD_ID, id)
    );
  }
}
