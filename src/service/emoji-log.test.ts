import { EmojiLog } from './emoji-log';

test('create emoji', async () => {
  const sendEmbed = jest.fn(() => Promise.resolve());
  const responder = new EmojiLog({ sendEmbed });
  await responder.on('CREATE', {
    emoji: '<:kawaehand:903283802443501618>',
    emojiAuthorId: '586824421470109716'
  });

  expect(sendEmbed).toHaveBeenCalledWith({
    title: '絵文字警察',
    description:
      '<@586824421470109716> が <:kawaehand:903283802443501618> を作成しました'
  });
});

test('create emoji(author undefined)', async () => {
  const sendEmbed = jest.fn(() => Promise.resolve());
  const responder = new EmojiLog({ sendEmbed });
  await responder.on('CREATE', {
    emoji: '<:kawaehand:903283802443501618>',
    emojiAuthorId: undefined
  });

  expect(sendEmbed).toHaveBeenCalledWith({
    title: '絵文字警察',
    description: '誰かが <:kawaehand:903283802443501618> を作成しました'
  });
});
