import type { MessageEvent, MessageEventResponder } from '../runner/message.js';
import { EmojiSeq } from '../model/emoji-seq.js';

const SEQUENCES = [new EmojiSeq('響', ['<:haracho:684424533997912096>'])];

export interface EmojiSeqObservable {
  content: string;

  addReaction(reaction: string): Promise<void>;
}

export class EmojiSeqReact<M extends EmojiSeqObservable>
  implements MessageEventResponder<M>
{
  async on(event: MessageEvent, message: M): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }
    for (const sequence of SEQUENCES) {
      if (sequence.shouldReactTo(message.content)) {
        for (const emoji of sequence.emojisToSend) {
          await message.addReaction(emoji);
        }
        return;
      }
    }
  }
}
