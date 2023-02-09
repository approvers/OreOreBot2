/**
 * 限界開発鯖はコミュニティサーバーではないので以下のチャンネルは2023-02-09現在利用できないため、個別のStatsは生やさない。
 * アナウンスチャンネル, アナウンスチャンネル(スレッド), ディレクトリチャンネル, フォーラムチャンネル, ステージチャンネル
 *
 * また、チャンネル検索の仕様上 DM は検索できないためこちらも対応しない
 */

// channel#Channel-Types - https://discord.com/developers/docs/resources/channel#channel-object-channel-types
export type ChannelType =
  | 'Text' // ID: 0
  | 'Voice' // ID: 2
  | 'Category' // ID: 4
  | 'Announce' // ID: 5
  | 'Announce(Thread)' // ID: 10
  | 'Thread(Public)' // ID: 11
  | 'Thread(Private)' // ID: 12
  | 'Stage' // ID: 13
  | 'Forum'; // ID: 15

// チャンネルが持つ詳細情報
export interface ChannelStats {
  name: string;
  createdAt?: Date;
  url: string;
  type: ChannelType;
  administrable: boolean;
  viewable: boolean;
}
