import type { DepRegistry } from '../../driver/dep-registry.js';
import type { HelpInfo } from '../../runner/command.js';
import type { CommandMessage, CommandResponderFor } from './command-message.js';

export interface VersionFetcher {
  version: string;
}
export interface VersionFetcherDep {
  type: VersionFetcher;
}
export const versionFetcherKey = Symbol(
  'VERSION_FETCHER'
) as unknown as VersionFetcherDep;

const SCHEMA = {
  names: ['version'],
  description: '現在の私のバージョンを出力するよ',
  subCommands: {}
} as const;

export class GetVersionCommand implements CommandResponderFor<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'はらちょバージョン',
    description: '現在の私のバージョンを出力するよ。',
    pageName: 'version'
  };
  readonly schema = SCHEMA;

  constructor(private readonly reg: DepRegistry) {}

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const { version } = this.reg.get(versionFetcherKey);
    await message.reply({
      title: 'はらちょバージョン',
      /**
       * v1.30.0以降、全てのTagの先頭には "oreorebot2-" という文字列が付与されるようになったため、ハードコーディングで対応
       * https://github.com/approvers/OreOreBot2/tags
       */
      description: `[${version}](https://github.com/approvers/OreOreBot2/releases/tag/OreOreBot2-v${version}) だよ。`,
      url: `https://github.com/approvers/OreOreBot2/releases`
    });
  }
}
