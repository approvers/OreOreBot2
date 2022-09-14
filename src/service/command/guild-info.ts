import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';

import type { MessageEvent } from '../../runner/message.js';
import type { Snowflake } from '../../model/id.js';
import { createTimestamp } from '../../model/create-timestamp.js';

export interface GuildStats {
  afkChannelId: Snowflake;
  afkTimeout: number;
  channelCount: number;
  createdAt: Date;
  emojiCount: number;
  id: Snowflake;
  large: boolean;
  membersCount: number;
  mfaLevel: GuildMfaLevel;
  name: string;
  nsfwLevel: GuildNsfwLevel;
  ownerId: Snowflake;
  boostTier: GuildPremiumTier;
  roleCount: number;
  stickerCount: number;
  verificationLevel: GuildVerificationLevel;
}

/**
 * 管理の2要素認証の設定状況を定義します。
 * ModやAdminアカウントを侵害する悪意ある人物のよる破壊行為を防止することが出来る設定です。
 * 要求している場合、モデレーション操作を行うには2要素認証をONにしている必要があります。
 * モデレーション操作として定義されているものとして、BANやKick、サーバーへのBot接続などが該当します。
 * 設定: サーバー設定 → 管理 | 安心設定 → 管理の2要素認証
 * https://discord.com/developers/docs/resources/guild#guild-object-mfa-level
 */
export type GuildMfaLevel = '2FAを要求しない' | '2FAを要求する';

/**
 * そのギルドのNSFWレベルを定義します。
 * https://discord.com/developers/docs/resources/guild#guild-object-guild-nsfw-level
 */
export type GuildNsfwLevel =
  | 'デフォルト'
  | 'iosユーザーに対する制限あり'
  | '安全'
  | '年齢制限';

/**
 * そのギルドのサーバーブーストのティア状況を定義します。
 * https://discord.com/developers/docs/resources/guild#guild-object-premium-tier
 */
export type GuildPremiumTier = 'ティア0' | 'ティア1' | 'ティア2' | 'ティア3';

/**
 * そのギルドの認証レベルを定義します。
 * この認証レベルはギルド全体に作用します。
 * 設定: サーバー設定 → 管理 | 安心設定 → 認証レベル
 * https://discord.com/developers/docs/resources/guild#guild-object-verification-level
 */
export type GuildVerificationLevel =
  | '制限なし'
  | '低(メール認証要求)'
  | '中(作成から5分経過したアカウントのみ)'
  | '高(限界開発鯖に参加して10分以上経過したアカウントのみ)'
  | '最高(電話番号認証要求)';

export interface GuildStatsRepository {
  fetchGuildStats(): Promise<GuildStats | null>;
}

const SCHEMA = {
  names: ['guildinfo', 'serverinfo'],
  subCommands: {}
} as const;

export class GuildInfo implements CommandResponder<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'ギルド秘書艦',
    description: '限界開発鯖の情報を持ってくるよ'
  };
  readonly schema = SCHEMA;

  constructor(private readonly repo: GuildStatsRepository) {}

  async on(
    event: MessageEvent,
    message: CommandMessage<typeof SCHEMA>
  ): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }

    const stats = await this.repo.fetchGuildStats();
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
  if (!afkChannelId) {
    return '未設定';
  }

  return `<#${afkChannelId}>(${afkTimeout})`;
}
