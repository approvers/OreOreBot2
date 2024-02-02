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
        stickerName: sticker.name,
        stickerImageUrl: sticker.url,
        stickerId: sticker.id as Snowflake,
        stickerAuthorId: author.id as Snowflake,
        stickerDescription: sticker.description ?? '説明無し',
        stickerTags: sticker.tags ?? '関連絵文字無し'
      });
    });
  }
}
