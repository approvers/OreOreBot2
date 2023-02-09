/**
 * 限界開発鯖はコミュニティサーバーではないので以下のチャンネルは2023-02-09現在利用できないため、個別のStatsは生やさない。
 * アナウンスチャンネル, アナウンスチャンネル(スレッド), ディレクトリチャンネル, フォーラムチャンネル, ステージチャンネル
 *
 * また、チャンネル検索の仕様上 DM は検索できないためこちらも対応しない
 */

// channel#Channel-Types - https://discord.com/developers/docs/resources/channel#channel-object-channel-types
export type ChannelType =
  | 'テキストチャンネル' // ID: 0
  | 'ボイスチャンネル' // ID: 2
  | 'カテゴリー' // ID: 4
  | 'アナウンスチャンネル' // ID: 5
  | 'アナウンスチャンネル(スレッド)' // ID: 10
  | '公開スレッド(パブリックスレッド)' // ID: 11
  | '非公開スレッド(プライベートスレッド)' // ID: 12
  | 'ステージチャンネル' // ID: 13
  | 'フォーラムチャンネル'; // ID: 15

// チャンネルが持つ詳細情報
export interface ChannelStats {
  name: string;
  createAt?: Date;
  url: string;
  type: ChannelType;
  manageable: boolean; // モデレーション操作可能か
  viewable: boolean;
}
