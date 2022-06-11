import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';
import type { MemeTemplate } from '../model/meme-template.js';
import type { MessageEvent } from '../runner/index.js';
import { dousurya } from './meme/dousurya.js';
import { hukueki } from './meme/hukueki.js';
import { lolicon } from './meme/lolicon.js';
import { n } from './meme/n.js';
import parse from 'cli-argparse';
import { takopi } from './meme/takopi.js';

const memes = [dousurya, hukueki, lolicon, n, takopi];
const memesByCommandName: Record<
  string,
  MemeTemplate<string, string> | undefined
> = Object.fromEntries(
  memes.flatMap((meme) => meme.commandNames.map((name) => [name, meme]))
);

export class Meme implements CommandResponder {
  help: Readonly<HelpInfo> = {
    title: 'ミーム構文機能',
    description: '何これ……引数のテキストを構文にはめ込むみたいだよ',
    commandName: memes.flatMap((meme) => meme.commandNames),
    argsFormat: [
      {
        name: '--help',
        description: 'その構文ごとの詳細なヘルプを表示します'
      }
    ]
  };

  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (event !== 'CREATE') return;
    const { args } = message;
    const [commandName, ...commandArgs] = args;
    const meme = memesByCommandName[commandName];
    if (!meme) {
      return;
    }
    const { flags, options, unparsed } = parse(commandArgs);
    const body = unparsed.join(' ');
    const sanitizedOptions = sanitizeOptions(options);
    if (flags['help'] || sanitizedOptions['help']) {
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
    const generated = meme.generate(
      {
        flags,
        options: sanitizedOptions,
        body
      },
      message.senderName
    );
    await message.reply({ description: generated });
  }
}

function sanitizeOptions(
  options: Record<string, string | string[] | undefined>
): Record<string, string | undefined> {
  const sanitized = { ...options };
  for (const key in sanitized) {
    if (!Object.hasOwn(sanitized, key)) {
      continue;
    }
    const entry = sanitized[key];
    if (Array.isArray(entry)) {
      sanitized[key] = entry.join(' ');
    }
  }
  return sanitized as Record<string, string | undefined>;
}
