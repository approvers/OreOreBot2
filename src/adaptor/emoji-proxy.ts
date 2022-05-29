import type { Client } from 'discord.js';
import type { EmojiData } from '../service/emoji-log';
import type { EmojiEventProvider } from '../runner';

export type EmojiHandler<E> = (emoji: E) => Promise<void>;

export class EmojiProxy implements EmojiEventProvider<EmojiData> {
  constructor(private readonly client: Client) {}

  onEmojiCreate(handler: EmojiHandler<EmojiData>): void {
    this.client.on('emojiCreate', (emoji) =>
      handler({
        emoji: emoji.toString(),
        emojiAuthorId: emoji.author?.id ?? undefined
      })
    );
  }
}
