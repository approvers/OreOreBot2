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
  administrable: boolean;
  viewable: boolean;
}
