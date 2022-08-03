import {
  UserStats,
  UserStatsRepository
} from '../../service/command/user-info.js';
import { Client } from 'discord.js';
import { Snowflake } from '../../model/id.js';

export class DiscordUserManager implements UserStatsRepository {
  constructor(
    private readonly client: Client,
    private readonly guildId: Snowflake
  ) {}

  async fetchStats(userId: string): Promise<UserStats | null> {
    const guild = await this.client.guilds.fetch(this.guildId);
    const member = await guild.members.fetch(userId);
    if (!member) {
      return null;
    }

    const joinedAt: Date | undefined = member.joinedAt ?? undefined;

    return {
      color: member.displayColor.toString(16).padStart(6, '0'),
      displayName: member.displayName,
      joinedAt: joinedAt,
      bot: member.user.bot,
      tag: member.user.tag
    };
  }
}
