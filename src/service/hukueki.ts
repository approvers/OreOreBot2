import { MessageEvent, MessageEventResponder } from '../runner';
import { CommandMessage } from './command-message';

export class Hukueki implements MessageEventResponder<CommandMessage> {
  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (event !== 'CREATE') return;
    const { args } = message;
    if (args.length < 1) return;

    switch (args[0]) {
      /**
       * ねぇ、将来何してるだろうね
       * 服役はしてないと良いね
       * 困らないでよ
       */
      case 'hukueki': {
        const hukuekiArgs = args[1];
        if (!hukuekiArgs) return;

        const hukuekiContext =
          'ねぇ、将来何してるだろうね\n' +
          hukuekiArgs +
          'はしてないといいね\n' +
          '困らないでよ';

        await message.reply({ description: hukuekiContext });
        break;
      }
      /**
       * だから僕はロリコンを辞めた - こるく (Music Video)
       */
      case 'lolicon': {
        const loliconArgs = args[1];
        if (!loliconArgs) return;
        await message.reply({
          description: `だから僕は${loliconArgs}を辞めた - ${message.senderName} (Music Video)`
        });
        break;
      }
      /**
       * 限界みたいな鯖に住んでる菱形はどうすりゃいいですか？
       */
      case 'dousureba': {
        const dousurebaArgs = args[1];
        if (!dousurebaArgs) return;
        await message.reply({
          description: `限界みたいな鯖に住んでる${dousurebaArgs}はどうすりゃいいですか？`
        });
        break;
      }
      default:
        return;
    }
  }
}
