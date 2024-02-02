import { expect, it, vi } from 'vitest';

import type { Snowflake } from '../model/id.js';
import { StickerLog } from './sticker-log.js';

it('create sticker', async () => {
  const sendEmbed = vi.fn(() => Promise.resolve());
  const responder = new StickerLog({ sendEmbed });
  await responder.on('CREATE', {
    stickerName: 'なないミーム',
    stickerAuthorId: '596121630930108426' as Snowflake,
    stickerId: '723382133388738601' as Snowflake,
    stickerImageUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
    stickerDescription: 'ﾁｭﾋﾟﾁｭﾋﾟﾁｬﾊﾟﾁｬﾊﾟwwwﾄﾞｩﾋﾞﾄﾞｩﾋﾞﾀﾞﾊﾞﾀﾞﾊﾞwww',
    stickerTags: '🐱'
  });

  expect(sendEmbed).toHaveBeenCalledWith({
    title: 'スタンプ警察',
    description: `<@596121630930108426> が **なないミーム** を作成しました`,
    thumbnail: {
      url: 'https://cdn.discordapp.com/embed/avatars/0.png'
    },
    footer: `ID: 723382133388738601`,
    fields: [
      {
        name: '説明',
        value: 'ﾁｭﾋﾟﾁｭﾋﾟﾁｬﾊﾟﾁｬﾊﾟwwwﾄﾞｩﾋﾞﾄﾞｩﾋﾞﾀﾞﾊﾞﾀﾞﾊﾞwww'
      },
      {
        name: '関連絵文字',
        value: '🐱'
      }
    ]
  });
});

it('does not call non-CREATE event', async () => {
  const sendEmbed = vi.fn(() => Promise.resolve());
  const responder = new StickerLog({ sendEmbed });
  await responder.on('UPDATE', {
    stickerName: 'なないミーム',
    stickerAuthorId: '596121630930108426' as Snowflake,
    stickerId: '723382133388738601' as Snowflake,
    stickerImageUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
    stickerDescription: 'ﾁｭﾋﾟﾁｭﾋﾟﾁｬﾊﾟﾁｬﾊﾟwwwﾄﾞｩﾋﾞﾄﾞｩﾋﾞﾀﾞﾊﾞﾀﾞﾊﾞwww',
    stickerTags: '🐱'
  });

  expect(sendEmbed).not.toHaveBeenCalled();
});
