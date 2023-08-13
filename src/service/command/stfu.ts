import type { Snowflake } from '../../model/id.js';
import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';

/**
 * `SheriffCommand` のための削除機能。
 */
export interface Sheriff {
  /**
   * 'channel' 内の 'historyRange' 件のメッセージ中の自身のメッセージを削除する。
   *
   * @param channel - 削除するメッセージを探すチャンネルの ID
   * @param historyRange - 履歴の最新から削除する件数
   */
  executeMessage(channel: Snowflake, historyRange: number): Promise<void>;
}

const SCHEMA = {
  names: ['stfu'],
  description: '私のうるさい発言をまとめて消すよ',
  subCommands: {},
  params: [
    {
      type: 'INTEGER',
      name: '削除個数',
      description:
        'はらちょのメッセージを削除する個数だよ。1 以上 50 以下の整数で指定してね。',
      defaultValue: 1,
      minValue: 1,
      maxValue: 50
    }
  ]
} as const;

/**
 * 'sftu' コマンドではらちょの直近のメッセージを削除する。
 */
export class SheriffCommand implements CommandResponder<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: '治安統率機構',
    description:
      'はらちょがうるさいときに治安維持するためのコマンドだよ。最新メッセージから 50 件以内のはらちょのメッセージを指定の個数だけ削除するよ。',
    pageName: 'stfu'
  };
  readonly schema = SCHEMA;

  constructor(private readonly sheriff: Sheriff) {}

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const [toRemove] = message.args.params;
    for (let i = 0; i < toRemove; ++i) {
      const channel = message.senderChannelId;
      await this.sheriff.executeMessage(channel, 50);
    }
    await message.react('👌');
  }
}
