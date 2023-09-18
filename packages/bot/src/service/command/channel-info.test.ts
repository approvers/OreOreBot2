import { afterEach, describe, expect, it, vi } from 'vitest';

import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';
import type { Snowflake } from '../../model/id.js';
import type { ChannelStatsRepository } from './channel-info.js';
import { ChannelInfo } from './channel-info.js';
import { createMockMessage } from './command-message.js';

describe('ChannelInfo', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const repo: ChannelStatsRepository = {
    fetchStats: (id) =>
      Promise.resolve(
        id === '101'
          ? {
              name: '無法地帯',
              createdAt: new Date(20200101),
              url: 'https://discord.com/channels/683939861539192860/690909527461199922',
              type: 'Text'
            }
          : null
      )
  };
  const channelInfo = new ChannelInfo(repo);

  it('gets info of role', async () => {
    const fetchStats = vi.spyOn(repo, 'fetchStats');
    const fn = vi.fn();

    await channelInfo.on(
      createMockMessage(
        parseStringsOrThrow(['channelinfo', '101'], channelInfo.schema),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'チャンネルの情報',
      description: '司令官、頼まれていた <#101> の情報だよ',
      fields: [
        {
          name: 'チャンネル名',
          value:
            '[無法地帯](https://discord.com/channels/683939861539192860/690909527461199922)',
          inline: true
        },
        {
          name: 'チャンネルタイプ',
          value: `Text`,
          inline: true
        },
        {
          name: '作成日時',
          value: `<t:20200>(<t:20200:R>)`,
          inline: true
        }
      ]
    });
    expect(fetchStats).toHaveBeenCalledOnce();
  });

  it('gets info of sender channel', async () => {
    const fetchStats = vi.spyOn(repo, 'fetchStats');
    const fn = vi.fn();

    await channelInfo.on(
      createMockMessage(
        parseStringsOrThrow(['channelinfo'], channelInfo.schema),
        fn,
        {
          senderChannelId: '101' as Snowflake
        }
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'チャンネルの情報',
      description: '司令官、頼まれていた <#101> の情報だよ',
      fields: [
        {
          name: 'チャンネル名',
          value:
            '[無法地帯](https://discord.com/channels/683939861539192860/690909527461199922)',
          inline: true
        },
        {
          name: 'チャンネルタイプ',
          value: `Text`,
          inline: true
        },
        {
          name: '作成日時',
          value: `<t:20200>(<t:20200:R>)`,
          inline: true
        }
      ]
    });
    expect(fetchStats).toHaveBeenCalledOnce();
  });

  it('errors with invalid id', async () => {
    const fetchStats = vi.spyOn(repo, 'fetchStats');
    const fn = vi.fn();

    await channelInfo.on(
      createMockMessage(
        parseStringsOrThrow(['channelinfo', '100'], channelInfo.schema),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: '引数エラー',
      description: '指定したIDのチャンネルが見つからないみたい...'
    });
    expect(fetchStats).toHaveBeenCalledOnce();
  });
});
