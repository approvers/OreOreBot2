import type { Dep0, DepRegistry } from '../../driver/dep-registry.js';
import type { Snowflake } from '../../model/id.js';
import type { HelpInfo } from '../../runner/command.js';
import type { CommandMessage, CommandResponderFor } from './command-message.js';

export interface MessageRepository {
  getMessageContent(
    channelId: Snowflake,
    messageId: Snowflake
  ): Promise<string | undefined>;
}
export interface MessageRepositoryDep extends Dep0 {
  type: MessageRepository;
}
export const messageRepositoryKey = Symbol(
  'MESSAGE_REPOSITORY'
) as unknown as MessageRepositoryDep;

const SCHEMA = {
  names: ['debug'],
  description: '同じチャンネル内のメッセージをコードブロックとして表示するよ',
  subCommands: {},
  params: [
    {
      type: 'MESSAGE',
      name: 'target',
      description: 'デバッグ表示したいメッセージのID'
    }
  ]
} as const;

const TRIPLE_BACK_QUOTES = /```/g;

export class DebugCommand implements CommandResponderFor<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'デバッガーはらちょ',
    description:
      'メッセージIDを渡すと、同じチャンネル内にあればそれをコードブロックとして表示するよ',
    pageName: 'debug'
  };
  readonly schema = SCHEMA;

  constructor(private readonly reg: DepRegistry) {}

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const {
      params: [messageId]
    } = message.args;

    const content = await this.reg
      .get(messageRepositoryKey)
      .getMessageContent(message.senderChannelId, messageId as Snowflake);
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
