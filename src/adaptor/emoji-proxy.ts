import { Client } from 'discord.js';
import { EmojiData } from '../service/emoji-log';
import { EmojiEventProvider } from '../runner';

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
