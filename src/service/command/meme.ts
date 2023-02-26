import yargs from 'yargs';

import type { MemeTemplate } from '../../model/meme-template.js';
import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';
import { memes } from './meme/index.js';

const memesByCommandName: Record<
  string,
  MemeTemplate<string, string, string, string> | undefined
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
    description: '何これ……引数のテキストを構文にはめ込むみたいだよ',
    pageName: 'meme'
  };
  readonly schema = SCHEMA;

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const { args } = message;
    const {
      name: commandName,
      params: [commandArgs]
    } = args;
    const meme = memesByCommandName[commandName];
    if (!meme) {
      return;
    }

    const builder = yargs(`${commandName} ${commandArgs.join(' ')}`);
    builder.help('info', meme.description);
    const flagsKeys = meme.flagsKeys ?? [];
    for (const flagKey of flagsKeys) {
      builder.boolean(flagKey);
    }
    const optionsKeys = meme.optionsKeys ?? [];
    for (const optionKey of optionsKeys) {
      builder.string(optionKey);
    }
    const requiredPositionalKeys = meme.requiredPositionalKeys ?? [];
    const optionalPositionalKeys = meme.optionalPositionalKeys ?? [];
    const formattedPositionalKeys = requiredPositionalKeys
      .map((key) => `<${key}>`)
      .concat(optionalPositionalKeys.map((key) => `[${key}]`))
      .join(' ');
    const formattedCommand = `${commandName} ${formattedPositionalKeys}`;

    builder.command(formattedCommand, meme.description, (subBuilder) => {
      for (const key of requiredPositionalKeys.concat(optionalPositionalKeys)) {
        subBuilder.positional(key, {
          type: 'string'
        });
      }
    });
    builder.fail(() => {
      // ignore the error
    });

    let argv: Record<string, unknown>;
    try {
      argv = await builder.parseAsync();
    } catch {
      await reportError(message, meme);
      return;
    }

    if (argv.help) {
      await message.reply({
        title: meme.commandNames.map((name) => `\`${name}\``).join('/'),
        url: `https://haracho.approvers.dev/references/commands/meme/${meme.pageName}`,
        description: meme.description
      });
      return;
    }

    const requiredPositionalsUnsafe = extract(argv, requiredPositionalKeys);
    for (const key of requiredPositionalKeys) {
      if (!Object.hasOwn(requiredPositionalsUnsafe, key)) {
        await reportError(message, meme);
        return;
      }
      const value = requiredPositionalsUnsafe[key] as string;
      if (value.startsWith('"') && value.endsWith('"')) {
        requiredPositionalsUnsafe[key] = value.slice(1, -1);
      }
    }
    const generated = meme.generate(
      {
        flags: extract(argv, flagsKeys) as Record<string, boolean | undefined>,
        options: extract(argv, optionsKeys) as Record<
          string,
          string | undefined
        >,
        requiredPositionals: requiredPositionalsUnsafe as Record<
          string,
          string
        >,
        optionalPositionals: extract(argv, optionalPositionalKeys) as Record<
          string,
          string | undefined
        >
      },
      message.senderName
    );
    await message.reply({ description: generated });
  }
}

async function reportError(
  message: CommandMessage<typeof SCHEMA>,
  meme: MemeTemplate<string, string, string, string>
) {
  await message.reply({
    title: '引数が不足してるみたいだ。',
    description: meme.errorMessage
  });
}

function extract(
  obj: Record<string, unknown>,
  keys: readonly string[]
): Record<string, unknown> {
  const ret: Record<string, unknown> = {};
  for (const key of keys) {
    if (Object.hasOwn(obj, key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
}
