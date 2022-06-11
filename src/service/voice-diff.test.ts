import { expect, it } from 'vitest';
import type { StandardOutput } from './output.js';
import { VoiceDiff } from './voice-diff.js';

it('use case of VoiceDiff', async () => {
  const outputJoin: StandardOutput = {
    sendEmbed(message) {
      expect(message).toStrictEqual({
        title: 'めるが限界に入りました',
        description: '何かが始まる予感がする。',
        color: 0x1e63e9,
        author: { name: 'はらちょからのお知らせ' },
        thumbnail: {
          url: 'https://cdn.discordapp.com/avatars/586824421470109716/9eb541e567f0ce82d34e55a37213c524.webp'
        }
      });
      return Promise.resolve();
    }
  };
  const outputLeave: StandardOutput = {
    sendEmbed(message) {
      expect(message).toStrictEqual({
        title: 'めるが限界から抜けました',
        description: 'あいつは良い奴だったよ...',
        color: 0x1e63e9,
        author: { name: 'はらちょからのお知らせ' },
        thumbnail: {
          url: 'https://cdn.discordapp.com/avatars/586824421470109716/9eb541e567f0ce82d34e55a37213c524.webp'
        }
      });
      return Promise.resolve();
    }
  };

  const responderJoin = new VoiceDiff(outputJoin);
  const responderLeave = new VoiceDiff(outputLeave);
  await responderJoin.on('JOIN', {
    userName: 'める',
    channelName: '限界',
    userAvatar:
      'https://cdn.discordapp.com/avatars/586824421470109716/9eb541e567f0ce82d34e55a37213c524.webp'
  });
  await responderLeave.on('LEAVE', {
    userName: 'める',
    channelName: '限界',
    userAvatar:
      'https://cdn.discordapp.com/avatars/586824421470109716/9eb541e567f0ce82d34e55a37213c524.webp'
  });
});
