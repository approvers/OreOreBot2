import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message';
import type { MessageEvent } from '../runner';
import { Snowflake } from '../model/id';

export interface Sheriff {
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
    description: 'はらちょの治安維持コマンドだよ',
    commandName: ['stfu'],
    argsFormat: []
  };

  constructor(private readonly sheriff: Sheriff) {}

  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }
    const channel = message.senderChannelId;
    const [commandName] = message.args;
    if (!this.help.commandName.includes(commandName)) {
      return;
    }

    //haracho deletion
    await this.sheriff.executeMessage(channel, 50);
  }
}
