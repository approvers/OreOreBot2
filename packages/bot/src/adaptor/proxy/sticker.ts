import type { Client } from 'discord.js';

import type { Snowflake } from '../../model/id.js';
import type { StickerEventProvider } from '../../runner/sticker.js';
import type { StickerData } from '../../service/sticker-log.js';

export type StickerHandler<S> = (sticker: S) => Promise<void>;

export class StickerProxy implements StickerEventProvider<StickerData> {
  constructor(private readonly client: Client) {}

  onStickerCreate(handler: StickerHandler<StickerData>): void {
    this.client.on('stickerCreate', async (sticker) => {
      const author = await sticker.fetchUser();
      if (!author) {
        throw new Error('Failed to fetch sticker author');
      }

      await handler({
        name: sticker.name,
        imageUrl: sticker.url,
        id: sticker.id as Snowflake,
        authorId: author.id as Snowflake,
        description: sticker.description ?? '説明無し',
        tags: sticker.tags ?? '関連絵文字無し'
      });
    });
  }
}
