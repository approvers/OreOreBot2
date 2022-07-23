import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';
import type { MessageEvent } from '../../runner/index.js';

export interface VersionFetcher {
  version: string;
}

export class GetVersionCommand implements CommandResponder {
  help: Readonly<HelpInfo> = {
    commandName: ['version'],
    title: 'はらちょバージョン',
    description: '現在の私のバージョンを出力するよ。',
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
    const { version } = this.fetcher;
    await message.reply({
      title: 'はらちょバージョン',
      description: `${version} だよ。`,
      url: `https://github.com/approvers/OreOreBot2/releases/tag/${version}`
    });
  }
}
