import { expect, it, vi } from 'vitest';

import type { Snowflake } from '../model/id.js';
import { EmojiLog } from './emoji-log.js';

it('create emoji', async () => {
  const sendEmbed = vi.fn(() => Promise.resolve());
  const responder = new EmojiLog({ sendEmbed });
  await responder.on('CREATE', {
    emoji: '<:kawaehand:903283802443501618>',
    emojiAuthorId: '586824421470109716' as Snowflake
  });

  expect(sendEmbed).toHaveBeenCalledWith({
    title: '絵文字警察',
    description:
      '<@586824421470109716> が <:kawaehand:903283802443501618> を作成しました'
  });
});
