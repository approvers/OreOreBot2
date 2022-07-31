import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';
import type { MessageEvent } from '../../runner/index.js';
import type { Snowflake } from '../../model/id.js';

/**
 * 'SheriffCommandのための削除機能。
 *
 * @export
 * @interface Sheriff
 */
export interface Sheriff {
  /**
   * 'channel' 内の 'historyRange' 件のメッセージ中の自身のメッセージを削除する。
   *
   * @param {Snowflake} channel
   * @param {number} historyRange
   */
  executeMessage(channel: Snowflake, historyRange: number): Promise<void>;
}
/**
 * 'sftu' コマンドではらちょの直近のメッセージを削除する・
 *
 * @export
 * @class Sheriff
 *
 */
export class SheriffCommand implements CommandResponder {
  help: Readonly<HelpInfo> = {
    title: '治安統率機構',
    description:
      'はらちょがうるさいときに治安維持するためのコマンドだよ。最新メッセージから 50 件以内のはらちょのメッセージを指定の個数だけ削除するよ。',
    commandName: ['stfu'],
    argsFormat: [
      {
        name: 'numbersToRemove',
        description:
          'はらちょのメッセージを削除する個数だよ。1 以上 50 以下の整数で指定してね。',
        defaultValue: '1'
      }
    ]
  };

  constructor(private readonly sheriff: Sheriff) {}

  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }

    const [commandName, numbersToRemove = '1'] = message.args;
    if (!this.help.commandName.includes(commandName)) {
      return;
    }
    const toRemove = parseInt(numbersToRemove, 10);
    if (Number.isNaN(toRemove) || !(1 <= toRemove && toRemove <= 50)) {
      await message.reply({
        title: '引数の範囲エラー',
        description: '1 以上 50 以下の整数を指定してね。'
      });
      return;
    }
    for (let i = 0; i < toRemove; ++i) {
      const channel = message.senderChannelId;
      await this.sheriff.executeMessage(channel, 50);
    }
    await message.react('👌');
  }
}
