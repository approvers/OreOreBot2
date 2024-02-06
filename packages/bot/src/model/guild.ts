import type { Dep0 } from '../driver/dep-registry.js';
import type { Snowflake } from './id.js';

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

export interface GuildRepository {
  fetchGuildStats(): Promise<GuildStats | null>;
}
export interface GuildRepositoryDep extends Dep0 {
  type: GuildRepository;
}
export const guildRepositoryKey = Symbol(
  'GUILD_REPOSITORY'
) as unknown as GuildRepositoryDep;
