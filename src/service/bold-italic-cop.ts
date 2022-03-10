import { MessageEvent } from '../runner';
import { MessageEventResponder } from '../runner';

export interface BoldItalicCop {
  /**
   * メッセージの内容.
   *
   * @type {string}
   * @memberof Observable
   */
  readonly content: string;

  /**
   * "Bold-Italic警察だ!!!" と返す。
   * @param message
   */
  replyMessage(message: { content: string }): Promise<void>;
}

export class BoldItalicCopReporter
  implements MessageEventResponder<BoldItalicCop>
{
  async on(event: MessageEvent, message: BoldItalicCop): Promise<void> {
    if (event !== 'CREATE') return;
    const boldItalicSize = message.content.match(/\*\*\*/g);
    if (!boldItalicSize) return;
    if (boldItalicSize.length >= 2) {
      await message.replyMessage({
        content: 'Bold-Italic警察だ!!! <:haracho:684424533997912096>'
      });
    }
  }
}
