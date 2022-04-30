import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message';
import type { MessageEvent } from '../runner';

export class Hukueki implements CommandResponder {
  help: Readonly<HelpInfo> = {
    title: '服役/ロリコン/ぬきたし構文/タコピー構文/えぬ構文',
    description: '何これ……引数のテキストを構文にはめ込むみたいだよ',
    commandName: ['hukueki', 'lolicon', 'dousureba', 'takopi', 'n'],
    argsFormat: [
      {
        name: '(タコピー構文のみ) -f',
        description:
          '教員と自分の名前の位置を反対にします。([idea: フライさん](https://github.com/approvers/OreOreBot2/issues/90))'
      },
      {
        name: 'テキスト',
        description: '構文にはめ込む文章'
      }
    ]
  };

  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (event !== 'CREATE') return;
    const { args } = message;
    if (args.length < 1) return;

    const [kind, ...remainings] = args;
    const messageArgs = remainings.filter((x) => !x.startsWith('-')).join(' ');
    const options = remainings.filter((x) => x.startsWith('-'));

    switch (kind) {
      /**
       * ねぇ、将来何してるだろうね
       * 服役はしてないと良いね
       * 困らないでよ
       */
      case 'hukueki': {
        if (!messageArgs) {
          await message.reply({
            title: '服役できなかった。',
            description: '引数が不足してるみたいだ。'
          });
          return;
        }

        const hukuekiContext =
          'ねぇ、将来何してるだろうね\n' +
          messageArgs +
          'はしてないといいね\n' +
          '困らないでよ';

        await message.reply({ description: hukuekiContext });
        break;
      }
      /**
       * だから僕はロリコンを辞めた - こるく (Music Video)
       */
      case 'lolicon': {
        if (!messageArgs) {
          await message.reply({
            title: 'こるくはロリコンをやめられなかった。',
            description: '引数が不足してるみたいだ。'
          });
          return;
        }

        await message.reply({
          description: `だから僕は${messageArgs}を辞めた - ${message.senderName} (Music Video)`
        });
        break;
      }
      /**
       * 限界みたいな鯖に住んでる菱形はどうすりゃいいですか？
       */
      case 'dousureba': {
        if (!messageArgs) {
          await message.reply({
            title: 'どうしようもない。',
            description: '引数が不足してるみたいだ。'
          });
          return;
        }

        await message.reply({
          description: `限界みたいな鯖に住んでる${messageArgs}はどうすりゃいいですか？`
        });
        break;
      }
      /**
       * 教員「課題，出して」
       * しずか「わ、わかんないっピ.......」
       */
      case 'takopi': {
        if (!messageArgs) {
          await message.reply({
            title: '(引数が)わ、わかんないっピ.......',
            description: '引数が不足してるみたいだ。'
          });
          return;
        }

        await message.reply({
          description: optionRail(messageArgs, options, message)
        });
        break;
      }
      /**
       * テスト前日に原神しててNった
       */
      case 'n': {
        if (!messageArgs) {
          await message.reply({
            title: 'Nった',
            description:
              '引数が不足してるみたいだ。このままだと <@521958252280545280> みたいに留年しちゃう....'
          });
          return;
        }

        await message.reply({
          description: `${messageArgs}てNった`
        });
        break;
      }
      default:
        return;
    }
  }
}

function optionRail(
  messageArgs: string,
  options: string[],
  message: CommandMessage
) {
  if (options.includes('-f'))
    return `${message.senderName}「${messageArgs}、出して」\n教員「わ、わかんないっピ.......」`;
  return `教員「${messageArgs}、出して」\n${message.senderName}「わ、わかんないっピ.......」`;
}
