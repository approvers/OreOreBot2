import { expect, it, mock } from 'bun:test';

import type { Snowflake } from '../model/id.js';
import { StickerLog } from './sticker-log.js';

it('create sticker', async () => {
  const sendEmbed = mock(() => Promise.resolve());
  const responder = new StickerLog({ sendEmbed });
  await responder.on('CREATE', {
    name: 'なないミーム',
    authorId: '596121630930108426' as Snowflake,
    id: '723382133388738601' as Snowflake,
    imageUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
    description: 'ﾁｭﾋﾟﾁｭﾋﾟﾁｬﾊﾟﾁｬﾊﾟwwwﾄﾞｩﾋﾞﾄﾞｩﾋﾞﾀﾞﾊﾞﾀﾞﾊﾞwww',
    tags: '🐱'
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
  const sendEmbed = mock(() => Promise.resolve());
  const responder = new StickerLog({ sendEmbed });
  await responder.on('UPDATE', {
    name: 'なないミーム',
    authorId: '596121630930108426' as Snowflake,
    id: '723382133388738601' as Snowflake,
    imageUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
    description: 'ﾁｭﾋﾟﾁｭﾋﾟﾁｬﾊﾟﾁｬﾊﾟwwwﾄﾞｩﾋﾞﾄﾞｩﾋﾞﾀﾞﾊﾞﾀﾞﾊﾞwww',
    tags: '🐱'
  });

  expect(sendEmbed).not.toHaveBeenCalled();
});
