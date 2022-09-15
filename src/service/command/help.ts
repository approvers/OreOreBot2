import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';
import type { Param, Schema } from '../../model/command-schema.js';

import type { CommandRunner } from '../../runner/command.js';
import type { EmbedPage } from '../../model/embed-message.js';

const SCHEMA = {
  names: ['help', 'h'],
  subCommands: {}
} as const;

export class HelpCommand implements CommandResponder<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'はらちょヘルプ',
    description: 'こんな機能が搭載されてるよ'
  };
  readonly schema = SCHEMA;

  constructor(private readonly runner: CommandRunner) {}

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const helpAndSchema = this.runner
      .getResponders()
      .map((responder) => ({ ...responder.help, ...responder.schema }));
    const pages: EmbedPage[] = helpAndSchema.map((helpScheme) =>
      this.buildField(helpScheme)
    );
    await message.replyPages(pages);
  }

  private buildField({
    title,
    description,
    names,
    params
  }: Readonly<
    HelpInfo & Schema<Record<string, unknown>, readonly Param[]>
  >): EmbedPage {
    const patternsWithDesc: [string, string][] =
      params?.map(({ name, description, defaultValue }) => [
        defaultValue === undefined
          ? `<${name}>`
          : `[${name}=${String(defaultValue)}]`,
        description
      ]) ?? [];
    const argsDescriptions = patternsWithDesc
      .map(([argPattern, description]) => `\`${argPattern}\`: ${description}`)
      .join('\n');
    const patterns = patternsWithDesc.map(([pattern]) => pattern);
    return {
      title,
      description: `${description}
\`${names.join('/')}${['', ...patterns].join(' ')}\`
${argsDescriptions}`
    };
  }
}
