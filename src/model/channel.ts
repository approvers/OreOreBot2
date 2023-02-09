/**
 * 限界開発鯖はコミュニティサーバーではないので以下のチャンネルは2023-02-09現在利用できないため、個別のStatsは生やさない。
 * アナウンスチャンネル, アナウンスチャンネル(スレッド), ディレクトリチャンネル, フォーラムチャンネル, ステージチャンネル
 *
 * また、チャンネル検索の仕様上 DM は検索できないためこちらも対応しない
 */

// channel#Channel-Types - https://discord.com/developers/docs/resources/channel#channel-object-channel-types
export type ChannelType =
  | 'テキストチャンネル' // ID: 0
  | 'DM' // ID: 1
  | 'ボイスチャンネル' // ID: 2
  | 'DM(グループ)' // ID: 3
  | 'カテゴリー' // ID: 4
  | 'アナウンスチャンネル' // ID: 5
  | 'アナウンスチャンネル(スレッド)' // ID: 10
  | '公開スレッド(パブリックスレッド)' // ID: 11
  | '非公開スレッド(プライベートスレッド)' // ID: 12
  | 'ステージチャンネル' // ID: 13
  | 'ディレクトリチャンネル' // ID: 14 - GUILD_DIRECTORY は流石に情報量が足りなさすぎる。正式名称は違う可能性あり
  | 'フォーラムチャンネル'; // ID: 15

// https://discord-api-types.dev/api/discord-api-types-v10/enum/VideoQualityMode
export type VideoQualityMode = 'オート' | 'フル(720p)';

// https://discord-api-types.dev/api/discord-api-types-v10/enum/ThreadAutoArchiveDuration
export type ThreadAutoArchiveDuration = '1h' | '1d' | '3d' | '1w';

// 全チャンネルタイプに対応したStats
export interface BaseChannelStats {
  name: string;
  createAt: Date;
  url: string;
  type: ChannelType;
  position: number; // チャンネルリスト上の位置
  manageable: boolean; // モデレーション操作可能か
  viewable: boolean;
}

// ボイスチャンネルに対応したStats
export interface VoiceChannelStats {
  bitrate: number;
  joinable: boolean;
  nsfw: boolean;
  rtcRegion?: string | null;
  speakable: boolean;
  userLimit: number;
  videoQuality?: VideoQualityMode | undefined;
}

// スレッドチャンネルに対応したStats
export interface ThreadChannelStats {
  archived: boolean;
  archivedAt: Date;
  autoArchiveDuration: ThreadAutoArchiveDuration;
  joinable: boolean;
  joined: boolean;
  locked: boolean;
  memberCount?: number | undefined;
  messageCount?: number | undefined;
  sendable: boolean;
  unarchivable: boolean;
}
