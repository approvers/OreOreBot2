import type { Snowflake } from '../model/id.js';
import type { EmojiEvent, EmojiEventResponder } from '../runner/index.js';
import type { StandardOutput } from './output.js';

export interface EmojiData {
  emoji: string;
  emojiAuthorId: Snowflake;
}

export class EmojiLog implements EmojiEventResponder<EmojiData> {
  constructor(private readonly output: StandardOutput) {}
  async on(
    event: EmojiEvent,
    { emoji, emojiAuthorId }: EmojiData
  ): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }

    await this.output.sendEmbed({
      title: '絵文字警察',
      description: `<@${emojiAuthorId}> が ${emoji} を作成しました`
    });
  }
}
