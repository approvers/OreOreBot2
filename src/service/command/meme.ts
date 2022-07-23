import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';
import type { MemeTemplate } from '../../model/meme-template.js';
import type { MessageEvent } from '../../runner/index.js';
import { dousurya } from './meme/dousurya.js';
import { hukueki } from './meme/hukueki.js';
import { lolicon } from './meme/lolicon.js';
import { n } from './meme/n.js';
import { nigetane } from './meme/nigetane.js';
import parse from 'cli-argparse';
import { takopi } from './meme/takopi.js';
import { web3 } from './meme/web3.js';

const memes = [dousurya, hukueki, lolicon, n, takopi, nigetane, web3];
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
