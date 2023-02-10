import type { MessageEvent, MessageEventResponder } from '../runner/index.js';

// 一つでも含まれていればよいため、最短マッチを行う
const boldItalic = /\*\*\*(?:.+?)\*\*\*/g;

export interface BoldItalicCop {
  /**
   * メッセージの内容。
   */
  readonly content: string;

  /**
   * 指定のメッセージでと返信する。
   * @param message - 返信内容
   */
  replyMessage(message: { content: string }): Promise<void>;
}

export class BoldItalicCopReporter
  implements MessageEventResponder<BoldItalicCop>
{
  async on(event: MessageEvent, message: BoldItalicCop): Promise<void> {
    if (event !== 'CREATE') return;
    const boldItalicSize = message.content.match(boldItalic);
    if (!boldItalicSize) return;
    if (boldItalicSize.length >= 1) {
      await message.replyMessage({
        content: 'Bold-Italic警察だ!!! <:haracho:684424533997912096>'
      });
    }
  }
}
