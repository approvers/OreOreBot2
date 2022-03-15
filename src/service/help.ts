import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message';
import type { MessageEvent, MessageResponseRunner } from '../runner';
import type { EmbedMessageField } from '../model/embed-message';

export class HelpCommand implements CommandResponder {
  help: Readonly<HelpInfo> = {
    title: 'はらちょヘルプ',
    description: 'こんな機能が搭載されてるよ',
    commandName: ['help', 'h'],
    argsFormat: []
  };

  constructor(
    private readonly runner: MessageResponseRunner<
      CommandMessage,
      CommandResponder
    >
  ) {}

  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    const { args } = message;
    if (event !== 'CREATE' || !this.help.commandName.includes(args[0])) {
      return;
    }
    const helps = this.runner
      .getResponders()
      .map((responder) => responder.help);
    const fields: EmbedMessageField[] = helps.map((help) =>
      this.buildField(help)
    );
    await message.reply({ fields });
  }

  private buildField({
    title,
    description,
    commandName,
    argsFormat
  }: Readonly<HelpInfo>): { name: string; value: string } {
    const patternsWithDesc: [string, string][] = argsFormat.map(
      ({ name, description, defaultValue }) => [
        defaultValue === undefined ? `<${name}>` : `[${name}=${defaultValue}]`,
        description
      ]
    );
    const argsDecrptions = patternsWithDesc
      .map(([argPattern, description]) => `\`${argPattern}\`: ${description}`)
      .join('\n');
    const patterns = patternsWithDesc.map(([pattern]) => pattern);
    return {
      name: title,
      value: `${description}
\`${commandName.join('/')}${['', ...patterns].join(' ')}\`
${argsDecrptions}`
    };
  }
}
