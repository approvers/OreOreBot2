import type { Client } from 'discord.js';
import type { RoleManager } from '../service/kawaemon-has-all-roles.js';
import type { Snowflake } from '../model/id.js';

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

  async removeRole(
    targetMember: Snowflake,
    removingRoleId: Snowflake
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(this.guildId);
    const member = await guild.members.fetch(targetMember);
    await member.roles.remove(removingRoleId);
  }
}
