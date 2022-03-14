import { Client } from 'discord.js';
import { Snowflake } from '../model/id';
import { RoleManager } from '../service/kawaemon-has-all-roles';

export class DiscordRoleManager implements RoleManager {
  constructor(
    private readonly client: Client,
    private readonly guildId: Snowflake
  ) {}

  async addRole(targetMember: Snowflake, newRoleId: Snowflake): Promise<void> {
    const guild = await this.client.guilds.fetch(this.guildId);
    const member = await guild.members.fetch(targetMember);
    await member.roles.add(newRoleId);
  }
}
