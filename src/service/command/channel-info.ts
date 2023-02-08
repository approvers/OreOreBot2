import type {
  BaseChannelStats,
  ThreadChannelStats,
  VoiceChannelStats
} from '../../model/channel.js';
import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';

export interface ChannelStatsRepository {
  fetchBaseChannelStats(channelId: string): Promise<BaseChannelStats | null>;
  fetchVoiceChannelStats(channelId: string): Promise<VoiceChannelStats | null>;
  fetchThreadChannelStats(
    channelId: string
  ): Promise<ThreadChannelStats | null>;
}

const SCHEMA = {
  names: ['channel', 'chinfo', 'channelinfo'],
  subCommands: {},
  params: [
    {
      type: 'CHANNEL',
      name: 'チャンネルID',
      description: 'このIDのチャンネルを調べるよ'
    }
  ]
} as const;

export class ChannelInfo implements CommandResponder<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'チャンネル秘書艦',
    description: '指定したチャンネルの情報を調べてくるよ'
  };

  readonly schema = SCHEMA;

  constructor(private readonly repo: ChannelStatsRepository) {}

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const [channelId] = message.args.params;

    const baseStats = await this.repo.fetchBaseChannelStats(channelId);
    if (!baseStats) {
      await message.reply({
        title: '引数エラー',
        description: '指定したIDのチャンネルが見つからないみたい...'
      });
      return;
    }

    switch (baseStats.rawType) {
      case 0:
      case 4: {
        // カテゴリーとテキストチャンネル
        break;
      }
      case 2: {
        // ボイスチャンネル
        break;
      }
      case 11:
      case 12: {
        // スレッドチャンネル
        break;
      }
      default: {
        await message.reply({
          title: '検索エラー',
          description:
            '指定したIDのチャンネルは私が把握できないタイプだったから調べられなかった...'
        });
        break;
      }
    }
  }
}
