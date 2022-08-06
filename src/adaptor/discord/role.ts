import type {
  RoleIcon,
  RoleStats,
  RoleStatsRepository
} from '../../service/command/role-info.js';
import type { Client } from 'discord.js';
import type { RoleManager } from '../../service/kawaemon-has-all-roles.js';
import type { Snowflake } from '../../model/id.js';

export class DiscordRoleManager implements RoleManager, RoleStatsRepository {
  constructor(
    private readonly client: Client,
    private readonly guildId: Snowflake
  ) {}

  async addRole(targetMember: Snowflake, newRoleId: Snowflake): Promise<void> {
    const guild = await this.client.guilds.fetch(this.guildId);
    if (!guild.available) {
      throw new Error('guild unavailable');
    }
    const member = await guild.members.fetch(targetMember);
    await member.roles.add(newRoleId);
  }

  async removeRole(
    targetMember: Snowflake,
    removingRoleId: Snowflake
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(this.guildId);
    if (!guild.available) {
      throw new Error('guild unavailable');
    }
    const member = await guild.members.fetch(targetMember);
    await member.roles.remove(removingRoleId);
  }

  async fetchStats(roleId: string): Promise<RoleStats | null> {
    const guild = await this.client.guilds.fetch(this.guildId);
    if (!guild.available) {
      throw new Error('guild unavailable');
    }
    const role = await guild.roles.fetch(roleId);
    if (!role) {
      return null;
    }
    const icon: RoleIcon | undefined = role.unicodeEmoji
      ? ({
          isUnicode: true,
          emoji: role.unicodeEmoji
        } as const)
      : role.icon
      ? ({
          isUnicode: false,
          hash: role.icon
        } as const)
      : undefined;
    return {
      color: role.color.toString(16).padStart(6, '0'),
      createdAt: role.createdAt,
      icon,
      numOfMembersBelonged: role.members.size,
      position: role.rawPosition
    };
  }
}
