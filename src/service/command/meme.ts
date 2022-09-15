import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';

import type { MemeTemplate } from '../../model/meme-template.js';
import { memes } from './meme/index.js';
import parse from 'cli-argparse';

const memesByCommandName: Record<
  string,
  MemeTemplate<string, string> | undefined
> = Object.fromEntries(
  memes.flatMap((meme) => meme.commandNames.map((name) => [name, meme]))
);

const SCHEMA = {
  names: memes.flatMap((meme) => meme.commandNames),
  subCommands: {},
  params: [
    {
      type: 'VARIADIC',
      name: '引数リスト',
      description:
        '各構文ごとの引数リスト。--help で各コマンドのヘルプが見られるよ',
      defaultValue: []
    }
  ]
} as const;

export class Meme implements CommandResponder<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'ミーム構文機能',
    description: '何これ……引数のテキストを構文にはめ込むみたいだよ'
  };
  readonly schema = SCHEMA;

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const { args } = message;
    const [[commandName, ...commandArgs]] = args.params;
    const meme = memesByCommandName[commandName];
    if (!meme) {
      return;
    }
    const sanitizedArgs = sanitizeArgs(commandArgs);
    const { flags, options, unparsed } = parse(sanitizedArgs);
    const body = unparsed.join(' ');
    if (flags['help'] || options['help']) {
      await message.reply({
        title: meme.commandNames.map((name) => `\`${name}\``).join('/'),
        description: meme.description
      });
      return;
    }
    if (body === '') {
      await message.reply({
        title: '引数が不足してるみたいだ。',
        description: meme.errorMessage
      });
      return;
    }
    const splitOptions = split(options);
    const generated = meme.generate(
      {
        flags,
        options: splitOptions,
        body
      },
      message.senderName
    );
    await message.reply({ description: generated });
  }
}

const TO_RID = /^(-+)?(__proto__|prototype|constructor)/g;

export function sanitizeArgs(args: readonly string[]): string[] {
  return args.flatMap((arg) => {
    if (TO_RID.test(arg)) {
      return [];
    }
    return [arg];
  });
}

function split(
  options: Record<string, string | string[] | undefined>
): Record<string, string | undefined> {
  return Object.fromEntries(
    Object.entries(options).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(' ') : value
    ])
  );
}
