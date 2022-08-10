import type {
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
import type { Guild } from 'discord.js';
import type { MemberStats } from '../../service/command/kokusei-chousa.js';
import type { Snowflake } from '../../model/id.js';

const mappingMfaLevel: Record<Guild['mfaLevel'], GuildMfaLevel> = {
  0: '2FAを要求しない',
  1: '2FAを要求する'
};

const mappingNsfwLevel: Record<Guild['nsfwLevel'], GuildNsfwLevel> = {
  0: 'デフォルト',
  1: 'iosユーザーに対する制限あり',
  2: '安全',
  3: '年齢制限'
};

const mappingBoostTier: Record<Guild['premiumTier'], GuildPremiumTier> = {
  0: 'ティア0',
  1: 'ティア1',
  2: 'ティア2',
  3: 'ティア3'
};

const mappingVerificationLevel: Record<
  Guild['verificationLevel'],
  GuildVerificationLevel
> = {
  0: '制限なし',
  1: '低(メール認証要求)',
  2: '中(作成から5分経過したアカウントのみ)',
  3: '高(限界開発鯖に参加して10分以上経過したアカウントのみ)',
  4: '最高(電話番号認証要求)'
};

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

    return {
      afkChannelId,
      afkTimeout: guild.afkTimeout,
      channelCount: guild.channels.cache.size,
      createdAt: guild.createdAt,
      emojiCount: guild.emojis.cache.size,
      id,
      large: guild.large,
      membersCount: guild.memberCount,
      mfaLevel: mappingMfaLevel[guild.mfaLevel],
      name: guild.name,
      nsfwLevel: mappingNsfwLevel[guild.nsfwLevel],
      ownerId,
      boostTier: mappingBoostTier[guild.premiumTier],
      roleCount: guild.roles.cache.size,
      stickerCount: guild.stickers.cache.size,
      verificationLevel: mappingVerificationLevel[guild.verificationLevel]
    };
  }
}
