import { REST, Routes } from 'discord.js';

import type { Snowflake } from '../../model/id.js';
import type { CommandRepository } from '../../service/command/register.js';

export class DiscordCommandRepository implements CommandRepository {
  constructor(
    private readonly rest: REST,
    private readonly APPLICATION_ID: string,
    private readonly GUILD_ID: string
  ) {}

  async currentCommands(): Promise<unknown[]> {
    return (await this.rest.get(
      Routes.applicationGuildCommands(this.APPLICATION_ID, this.GUILD_ID)
    )) as unknown[];
  }
  async createCommand(command: {
    [key: string]: unknown;
    name: string;
  }): Promise<void> {
    await this.rest.post(
      Routes.applicationGuildCommands(this.APPLICATION_ID, this.GUILD_ID),
      {
        body: command
      }
    );
  }
  async updateCommand(command: {
    [key: string]: unknown;
    name: string;
    id: string;
  }): Promise<void> {
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
