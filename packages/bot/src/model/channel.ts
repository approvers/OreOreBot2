import type { Dep0 } from '../driver/dep-registry.js';

// 全チャンネルタイプ
export type ChannelType =
  | 'Text'
  | 'Voice'
  | 'Category'
  | 'Announce'
  | 'Announce(Thread)'
  | 'Thread(Public)'
  | 'Thread(Private)'
  | 'Stage'
  | 'Forum';

// チャンネルが持つ詳細情報
export interface ChannelStats {
  name: string;
  createdAt?: Date;
  url: string;
  type: ChannelType;
}

export interface ChannelRepository {
  fetchStats(channelId: string): Promise<ChannelStats | null>;
}
export interface ChannelRepositoryDep extends Dep0 {
  type: ChannelRepository;
}
export const channelRepositoryKey = Symbol(
  'CHANNEL_REPOSITORY'
) as unknown as ChannelRepositoryDep;
