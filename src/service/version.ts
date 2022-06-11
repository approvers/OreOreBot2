import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';
import type { MessageEvent } from '../runner/index.js';

export interface VersionFetcher {
  version: string;
}

export class GetVersionCommand implements CommandResponder {
  help: Readonly<HelpInfo> = {
    commandName: ['version'],
    title: 'はらちょバージョン',
    description: 'OreOreBot2 のバージョンを出力するよ。',
    argsFormat: []
  };

  constructor(private readonly fetcher: VersionFetcher) {}

  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }
    if (!this.help.commandName.includes(message.args[0])) {
      return;
    }
    await message.reply({
      title: 'はらちょバージョン',
      description: `${this.fetcher.version} だよ。`
    });
  }
}
