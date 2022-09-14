import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';

import type { MessageEvent } from '../../runner/message.js';
import type { Snowflake } from '../../model/id.js';

export interface MessageRepository {
  getMessageContent(
    channelId: Snowflake,
    messageId: Snowflake
  ): Promise<string | undefined>;
}

const SCHEMA = {
  names: ['debug'],
  subCommands: {},
  params: [
    {
      type: 'MESSAGE',
      name: 'メッセージID',
      description: 'デバッグ表示したいメッセージのID'
    }
  ]
} as const;

const TRIPLE_BACK_QUOTES = /```/g;

export class DebugCommand implements CommandResponder<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'デバッガーはらちょ',
    description:
      'メッセージIDを渡すと、同じチャンネル内にあればそれをコードブロックとして表示するよ'
  };
  readonly schema = SCHEMA;

  constructor(private readonly repo: MessageRepository) {}

  async on(
    event: MessageEvent,
    message: CommandMessage<typeof SCHEMA>
  ): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }

    const {
      params: [messageId]
    } = message.args;

    const content = await this.repo.getMessageContent(
      message.senderChannelId,
      messageId as Snowflake
    );
    if (!content) {
      await message.reply({
        title: '指定のメッセージが見つからなかったよ',
        description: 'そのメッセージがこのチャンネルにあるかどうか確認してね。'
      });
      return;
    }
    const contentIncludesBackQuotes = content.includes('```');
    const sanitized = content.replace(TRIPLE_BACK_QUOTES, "'''");
    await message.reply({
      title: 'デバッグ出力',
      description: `\`\`\`\n${sanitized}\n\`\`\``,
      footer: contentIncludesBackQuotes
        ? "三連続の ` (バッククォート) は ' (シングルクォート) に置換してあるよ。"
        : undefined
    });
  }
}
