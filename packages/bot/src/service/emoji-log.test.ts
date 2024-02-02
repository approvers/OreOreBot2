import { expect, it, vi } from 'vitest';

import type { Snowflake } from '../model/id.js';
import { EmojiLog } from './emoji-log.js';

it('create emoji', async () => {
  const sendEmbed = vi.fn(() => Promise.resolve());
  const responder = new EmojiLog({ sendEmbed });
  await responder.on('CREATE', {
    emoji: '<:kawaehand:903283802443501618>',
    id: '903283802443501618' as Snowflake,
    authorId: '586824421470109716' as Snowflake,
    imageUrl: 'https://cdn.discordapp.com/emojis/903283802443501618.png'
  });

  expect(sendEmbed).toHaveBeenCalledWith({
    title: '絵文字警察',
    description: `<@586824421470109716> が <:kawaehand:903283802443501618> を作成しました`,
    thumbnail: {
      url: 'https://cdn.discordapp.com/emojis/903283802443501618.png'
    },
    footer: `ID: 903283802443501618`
  });
});

it('does not call non-CREATE event', async () => {
  const sendEmbed = vi.fn(() => Promise.resolve());
  const responder = new EmojiLog({ sendEmbed });
  await responder.on('UPDATE', {
    emoji: '<:kawaehand:903283802443501618>',
    id: '903283802443501618' as Snowflake,
    authorId: '586824421470109716' as Snowflake,
    imageUrl: 'https://cdn.discordapp.com/emojis/903283802443501618.png'
  });

  expect(sendEmbed).not.toHaveBeenCalled();
});
