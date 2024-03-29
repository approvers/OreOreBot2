import type { DepRegistry } from '../../driver/dep-registry.js';
import {
  channelRepositoryKey,
  type ChannelStats
} from '../../model/channel.js';
import { createTimestamp } from '../../model/create-timestamp.js';
import type { HelpInfo } from '../../runner/command.js';
import type { CommandMessage, CommandResponderFor } from './command-message.js';

const SCHEMA = {
  names: ['channel', 'chinfo', 'channelinfo'],
  description: 'チャンネルの情報を調べてくるよ',
  subCommands: {},
  params: [
    {
      type: 'CHANNEL',
      name: 'target',
      description:
        'このIDのチャンネルを調べるよ。指定しない場合は実行したチャンネルを調べるよ',
      defaultValue: 'me'
    }
  ]
} as const;

export class ChannelInfo implements CommandResponderFor<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'チャンネル秘書艦',
    description: '指定したチャンネルの情報を調べてくるよ',
    pageName: 'channel-info'
  };

  readonly schema = SCHEMA;

  constructor(private readonly reg: DepRegistry) {}

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const [args] = message.args.params;
    const channelId = fetchChannelId(args, message.senderChannelId);

    const stats = await this.reg
      .get(channelRepositoryKey)
      .fetchStats(channelId);
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
    { name, createdAt, url, type }: ChannelStats,
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
        value: type,
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
      description: `司令官、頼まれていた <#${channelId}> の情報だよ`,
      fields
    };
  }
}

function fetchChannelId(args: string, messageChannelId: string) {
  if (args === 'me') {
    return messageChannelId;
  }

  return args;
}
