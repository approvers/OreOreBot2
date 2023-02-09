import type { ChannelStats } from '../../model/channel.js';
import { createTimestamp } from '../../model/create-timestamp.js';
import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';

export interface ChannelStatsRepository {
  fetchStats(channelId: string): Promise<ChannelStats | null>;
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

    const stats = await this.repo.fetchStats(channelId);
    if (!stats) {
      await message.reply({
        title: '引数エラー',
        description: '指定したIDのチャンネルが見つからないみたい...'
      });
      return;
    }

    await message.reply(this.buildEmbed(stats, channelId));
  }

  private buildEmbed(
    { name, createdAt, url, type, administrable, viewable }: ChannelStats,
    channelId: string
  ) {
    const fields = [
      {
        name: 'チャンネル名',
        value: `[${name}](${url})`,
        inline: true
      },
      {
        name: 'チャンネルタイプ',
        value: `${type}`,
        inline: true
      },
      {
        name: '管理可能か',
        value: administrable ? '可能' : '不可能',
        inline: true
      },
      {
        name: '表示可能か',
        value: viewable ? '可能' : '不可能',
        inline: true
      },
      {
        name: '作成日時',
        value: createTimestamp(createdAt),
        inline: true
      }
    ];

    return {
      title: 'チャンネルの情報',
      description: `司令官、頼まれていた <#${channelId}>の情報だよ`,
      fields
    };
  }
}
