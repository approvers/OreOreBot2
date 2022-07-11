import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';
import type { MessageEvent } from '../runner/message.js';
import type { Snowflake } from '../model/id.js';

export interface MessageRepository {
  getMessageContent(
    channelId: Snowflake,
    messageId: Snowflake
  ): Promise<string | undefined>;
}

export class DebugCommand implements CommandResponder {
  help: Readonly<HelpInfo> = {
    title: 'デバッガーはらちょ',
    description:
      'メッセージIDを渡すと、同じチャンネル内にあればそれをコードブロックとして表示するよ',
    commandName: ['debug'],
    argsFormat: [
      {
        name: 'messageId',
        description: 'デバッグ表示したいメッセージのID'
      }
    ]
  };

  constructor(private readonly repo: MessageRepository) {}

  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }

    const [commandName, messageId] = message.args;
    if (!this.help.commandName.includes(commandName)) {
      return;
    }
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
    const contentIncludesBackQuotes = content.includes('`');
    await message.reply({
      title: 'デバッグ出力',
      description: `\`\`\`\n${content.replace(/`/g, "'")}\n\`\`\``,
      footer: contentIncludesBackQuotes
        ? "` (バッククォート) は ' (シングルクォート) に置換してあるよ。"
        : undefined
    });
  }
}
