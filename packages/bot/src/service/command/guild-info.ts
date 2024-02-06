import type { DepRegistry } from '../../driver/dep-registry.js';
import { createTimestamp } from '../../model/create-timestamp.js';
import { guildRepositoryKey, type GuildStats } from '../../model/guild.js';
import type { Snowflake } from '../../model/id.js';
import type { HelpInfo } from '../../runner/command.js';
import type { CommandMessage, CommandResponderFor } from './command-message.js';

const SCHEMA = {
  names: ['guildinfo', 'serverinfo', 'guild', 'server'],
  description: '限界開発鯖の情報を持ってくるよ',
  subCommands: {}
} as const;

export class GuildInfo implements CommandResponderFor<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'ギルド秘書艦',
    description: '限界開発鯖の情報を持ってくるよ',
    pageName: 'guild-info'
  };
  readonly schema = SCHEMA;

  constructor(private readonly reg: DepRegistry) {}

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const stats = await this.reg.get(guildRepositoryKey).fetchGuildStats();
    if (!stats) {
      await message.reply({
        title: '取得エラー',
        description: '限界開発鯖の情報が見つからないみたい……'
      });
      return;
    }

    await message.reply(this.buildEmbed(stats));
  }

  private buildEmbed({
    afkChannelId,
    afkTimeout,
    channelCount,
    createdAt,
    emojiCount,
    id,
    large,
    membersCount,
    mfaLevel,
    name,
    nsfwLevel,
    ownerId,
    boostTier,
    roleCount,
    stickerCount,
    verificationLevel
  }: GuildStats) {
    const fields = [
      {
        name: 'サーバー名',
        value: `${name}\n(${id})`,
        inline: true
      },
      {
        name: 'オーナー',
        value: `<@${ownerId}>\n(${ownerId})`,
        inline: true
      },
      {
        name: 'AFK設定',
        value: makeAfkChannelMention(afkChannelId, afkTimeout),
        inline: true
      },
      {
        name: 'チャンネル数',
        value: `${channelCount}`,
        inline: true
      },
      {
        name: '絵文字数',
        value: `${emojiCount}`,
        inline: true
      },
      {
        name: 'ロール数',
        value: `${roleCount}`,
        inline: true
      },
      {
        name: 'ステッカー数',
        value: `${stickerCount}`,
        inline: true
      },
      {
        name: '全メンバー数',
        value: `${membersCount}`,
        inline: true
      },
      {
        name: '規模',
        value: large ? '大規模' : '小規模',
        inline: true
      },
      {
        name: '管理の2要素認証',
        value: mfaLevel,
        inline: true
      },
      {
        name: 'NSFWレベル',
        value: nsfwLevel,
        inline: true
      },
      {
        name: 'ブースト状況',
        value: boostTier,
        inline: true
      },
      {
        name: '認証レベル',
        value: verificationLevel,
        inline: true
      },
      {
        name: '作成日時',
        value: createTimestamp(createdAt),
        inline: true
      }
    ];

    return {
      title: 'サーバーの情報',
      description: '司令官、頼まれていた例の場所の情報だよ',
      fields
    };
  }
}

function makeAfkChannelMention(afkChannelId: Snowflake, afkTimeout: number) {
  return `<#${afkChannelId}>(${afkTimeout})`;
}
