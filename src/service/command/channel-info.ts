import type {
  BaseChannelStats,
  ThreadChannelStats,
  VoiceChannelStats
} from '../../model/channel.js';
import { createTimestamp } from '../../model/create-timestamp.js';
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

    await message.reply(this.buildBaseEmbed(baseStats, channelId));
  }

  private buildBaseEmbed(
    {
      name,
      createAt,
      url,
      type,
      position,
      manageable,
      viewable
    }: BaseChannelStats,
    channelId: string
  ) {
    const fields = [
      {
        name: 'チャンネル名',
        value: `[${name}](${url})`,
        inline: true
      },
      {
        name: 'チャンネルID',
        value: `${channelId}`,
        inline: true
      },
      {
        name: 'チャンネルタイプ',
        value: `${type}`,
        inline: true
      },
      {
        name: 'ポジション',
        value: `${position}`,
        inline: true
      },
      {
        name: '管理可能か',
        value: manageable ? '可能' : '不可能',
        inline: true
      },
      {
        name: '表示可能か',
        value: viewable ? '可能' : '不可能',
        inline: true
      },
      {
        name: '作成日時',
        value: createTimestamp(createAt),
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
