import { EmojiSeqSet } from '../model/emoji-seq.js';
import type { MessageEvent, MessageEventResponder } from '../runner/message.js';

export interface EmojiSeqObservable {
  content: string;

  addReaction(reaction: string): Promise<void>;
}

export class EmojiSeqReact<M extends EmojiSeqObservable>
  implements MessageEventResponder<M>
{
  private readonly sequences: EmojiSeqSet;

  constructor(sequencesYaml: string) {
    this.sequences = EmojiSeqSet.fromYaml(sequencesYaml);
  }

  async on(event: MessageEvent, message: M): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }
    const what = this.sequences.whatShouldBeReactTo(message.content);
    if (what) {
      for (const emoji of what) {
        await message.addReaction(emoji);
      }
    }
  }
}
