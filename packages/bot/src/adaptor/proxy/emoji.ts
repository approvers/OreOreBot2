import type { Client } from 'discord.js';

import type { Snowflake } from '../../model/id.js';
import type { EmojiEventProvider } from '../../runner/index.js';
import type { EmojiData } from '../../service/emoji-log.js';

export type EmojiHandler<E> = (emoji: E) => Promise<void>;

export class EmojiProxy implements EmojiEventProvider<EmojiData> {
  constructor(private readonly client: Client) {}

  onEmojiCreate(handler: EmojiHandler<EmojiData>): void {
    this.client.on('emojiCreate', async (emoji) => {
      const author = await emoji.fetchAuthor();

      await handler({
        emoji: emoji.toString(),
        id: emoji.id as Snowflake,
        authorId: author.id as Snowflake,
        imageUrl: emoji.url
      });
    });
  }
}
