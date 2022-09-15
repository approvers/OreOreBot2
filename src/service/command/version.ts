import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';

export interface VersionFetcher {
  version: string;
}

const SCHEMA = {
  names: ['version'],
  subCommands: {}
} as const;

export class GetVersionCommand implements CommandResponder<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'はらちょバージョン',
    description: '現在の私のバージョンを出力するよ。'
  };
  readonly schema = SCHEMA;

  constructor(private readonly fetcher: VersionFetcher) {}

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const { version } = this.fetcher;
    await message.reply({
      title: 'はらちょバージョン',
      description: `[${version}](https://github.com/approvers/OreOreBot2/releases/tag/${version}) だよ。`,
      url: `https://github.com/approvers/OreOreBot2/releases`
    });
  }
}
