import {
  GuildMfaLevel,
  GuildNsfwLevel,
  GuildPremiumTier,
  GuildStats,
  GuildStatsRepository,
  GuildVerificationLevel
} from '../../service/command/guild-info.js';
import type {
  MemberWithRole,
  MembersWithRoleRepository
} from '../../service/command/role-rank.js';
import type {
  UserStats,
  UserStatsRepository
} from '../../service/command/user-info.js';
import type { Client } from 'discord.js';
import type { MemberStats } from '../../service/command/kokusei-chousa.js';
import type { Snowflake } from '../../model/id.js';

export class DiscordMemberStats
  implements
    MemberStats,
    MembersWithRoleRepository,
    UserStatsRepository,
    GuildStatsRepository
{
  constructor(
    private readonly client: Client,
    private readonly guildId: Snowflake
  ) {}

  async allMemberCount(): Promise<number> {
    const guild = await this.client.guilds.fetch(this.guildId);
    if (!guild.available) {
      throw new Error('guild unavailable');
    }
    return guild.memberCount;
  }

  async botMemberCount(): Promise<number> {
    const guild = await this.client.guilds.fetch(this.guildId);
    if (!guild.available) {
      throw new Error('guild unavailable');
    }
    const guildMemberList = await guild.members.list({ limit: 1000 });
    return guildMemberList.filter((member) => member.user.bot).size;
  }

  async fetchMembersWithRole(): Promise<MemberWithRole[]> {
    const guild = await this.client.guilds.fetch(this.guildId);
    if (!guild.available) {
      throw new Error('guild unavailable');
    }
    const guildMemberList = await guild.members.list({ limit: 1000 });
    return guildMemberList.map(({ displayName, roles }) => ({
      displayName,
      roles: roles.cache.size
    }));
  }

  async fetchUserStats(userId: string): Promise<UserStats | null> {
    const guild = await this.client.guilds.fetch(this.guildId);
    if (!guild.available) {
      throw new Error('guild unavailable');
    }
    const member = await guild.members.fetch(userId);
    if (!member) {
      return null;
    }

    const joinedAt: Date | undefined = member.joinedAt ?? undefined;
    const hoistRoleId = (member.roles.hoist?.id as Snowflake) ?? undefined;
    const createdAt = member.user.createdAt;

    return {
      color: member.displayColor.toString(16).padStart(6, '0'),
      displayName: member.displayName,
      joinedAt,
      createdAt,
      bot: member.user.bot,
      tag: member.user.tag,
      hoistRoleId: hoistRoleId
    };
  }

  async fetchGuildStats(): Promise<GuildStats | null> {
    const guild = await this.client.guilds.fetch(this.guildId);
    if (!guild.available) {
      throw new Error('guild unavailable');
    }

    const afkChannelId = guild.afkChannelId as Snowflake;
    const id = guild.id as Snowflake;
    const ownerId = guild.ownerId as Snowflake;
    const mfaLevel = guild.mfaLevel as unknown as GuildMfaLevel;
    const nsfwLevel = guild.nsfwLevel as unknown as GuildNsfwLevel;
    const boostTir = guild.premiumTier as unknown as GuildPremiumTier;
    const verificationLevel =
      guild.verificationLevel as unknown as GuildVerificationLevel;

    return {
      afkChannelId,
      afkTimeout: guild.afkTimeout,
      channelCount: guild.channels.cache.size,
      createdAt: guild.createdAt,
      emojiCount: guild.emojis.cache.size,
      id,
      large: guild.large,
      membersCount: guild.memberCount,
      mfaLevel,
      name: guild.name,
      nsfwLevel,
      ownerId,
      boostTir,
      roleCount: guild.roles.cache.size,
      stickerCount: guild.stickers.cache.size,
      verificationLevel
    };
  }
}
