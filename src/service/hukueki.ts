import { MessageEvent, MessageEventResponder } from '../runner';
import { CommandMessage } from './command-message';

export class Hukueki implements MessageEventResponder<CommandMessage> {
  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (event !== 'CREATE') return;
    const { args } = message;
    if (args.length < 1) return;

    const [kind, arg] = args;

    switch (kind) {
      /**
       * ねぇ、将来何してるだろうね
       * 服役はしてないと良いね
       * 困らないでよ
       */
      case 'hukueki': {
        if (!arg) {
          await message.reply({
            title: '服役できなかった。',
            description: '引数が不足してるみたいだ。'
          });
          return;
        }

        const hukuekiContext =
          'ねぇ、将来何してるだろうね\n' +
          arg +
          'はしてないといいね\n' +
          '困らないでよ';

        await message.reply({ description: hukuekiContext });
        break;
      }
      /**
       * だから僕はロリコンを辞めた - こるく (Music Video)
       */
      case 'lolicon': {
        if (!arg) {
          await message.reply({
            title: 'こるくはロリコンをやめられなかった。',
            description: '引数が不足してるみたいだ。'
          });
          return;
        }

        await message.reply({
          description: `だから僕は${arg}を辞めた - ${message.senderName} (Music Video)`
        });
        break;
      }
      /**
       * 限界みたいな鯖に住んでる菱形はどうすりゃいいですか？
       */
      case 'dousureba': {
        if (!arg) {
          await message.reply({
            title: 'どうしようもない。',
            description: '引数が不足してるみたいだ。'
          });
          return;
        }

        await message.reply({
          description: `限界みたいな鯖に住んでる${arg}はどうすりゃいいですか？`
        });
        break;
      }
      default:
        return;
    }
  }
}
