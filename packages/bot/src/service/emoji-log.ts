import type { Snowflake } from '../model/id.js';
import type { EmojiEvent, EmojiEventResponder } from '../runner/index.js';
import type { StandardOutput } from './output.js';

export interface EmojiData {
  emoji: string;
  id: Snowflake;
  authorId: Snowflake;
  imageUrl: string;
}

export class EmojiLog implements EmojiEventResponder<EmojiData> {
  constructor(private readonly output: StandardOutput) {}
  async on(event: EmojiEvent, emoji: EmojiData): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }

    await this.output.sendEmbed(this.buildEmbed(emoji));
  }

  private buildEmbed({ emoji, id, authorId, imageUrl }: EmojiData) {
    return {
      title: '絵文字警察',
      description: `<@${authorId}> が ${emoji} を作成しました`,
      thumbnail: {
        url: imageUrl
      },
      footer: `ID: ${id}`
    };
  }
}
