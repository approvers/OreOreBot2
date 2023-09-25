import type { Schema } from '../../model/command-schema.js';
import type { EmbedPage } from '../../model/embed-message.js';
import type { CommandRunner, HelpInfo } from '../../runner/command.js';
import type { CommandMessage, CommandResponderFor } from './command-message.js';

const SCHEMA = {
  names: ['help', 'h'],
  description: '搭載機能の説明を表示するよ',
  subCommands: {}
} as const;

export class HelpCommand implements CommandResponderFor<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'はらちょヘルプ',
    description: 'こんな機能が搭載されてるよ',
    pageName: 'help'
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
    await message.replyPages(pages, {
      usersCanPaginate: [message.senderId]
    });
  }

  private buildField({
    title,
    description,
    pageName,
    names,
    params
  }: Readonly<HelpInfo & Schema>): EmbedPage {
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
      url: `https://haracho.approvers.dev/references/commands/${pageName}`,
      description: `${description}
\`${names.join('/')}${['', ...patterns].join(' ')}\`
${argsDescriptions}`
    };
  }
}
