import { afterEach, describe, expect, it, vi } from 'vitest';

import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';
import { DepRegistry } from '../../driver/dep-registry.js';
import { guildRepositoryKey, type GuildRepository } from '../../model/guild.js';
import type { Snowflake } from '../../model/id.js';
import { createMockMessage } from './command-message.js';
import { GuildInfo } from './guild-info.js';

describe('GuildInfo', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const repo: GuildRepository = {
    fetchGuildStats: () =>
      Promise.resolve({
        afkChannelId: '888657623182868480' as Snowflake,
        afkTimeout: 300,
        channelCount: 200,
        createdAt: new Date(20050902),
        emojiCount: 150,
        id: '683939861539192860' as Snowflake,
        large: true,
        membersCount: 1500000,
        mfaLevel: '2FAを要求する',
        name: '限界しない開発鯖',
        nsfwLevel: '年齢制限',
        ownerId: '521958252280545280' as Snowflake,
        boostTier: 'ティア3',
        roleCount: 150,
        stickerCount: 230,
        verificationLevel: '最高(電話番号認証要求)'
      })
  };
  const reg = new DepRegistry();
  reg.add(guildRepositoryKey, repo);
  const guildInfo = new GuildInfo(reg);

  it('Success GuildInfo', async () => {
    const fetchStats = vi.spyOn(repo, 'fetchGuildStats');
    const fn = vi.fn();

    await guildInfo.on(
      createMockMessage(
        parseStringsOrThrow(['guildinfo'], guildInfo.schema),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'サーバーの情報',
      description: '司令官、頼まれていた例の場所の情報だよ',
      fields: [
        {
          name: 'サーバー名',
          value: `限界しない開発鯖\n(683939861539192860)`,
          inline: true
        },
        {
          name: 'オーナー',
          value: `<@521958252280545280>\n(521958252280545280)`,
          inline: true
        },
        {
          name: 'AFK設定',
          value: `<#888657623182868480>(300)`,
          inline: true
        },
        {
          name: 'チャンネル数',
          value: `200`,
          inline: true
        },
        {
          name: '絵文字数',
          value: `150`,
          inline: true
        },
        {
          name: 'ロール数',
          value: `150`,
          inline: true
        },
        {
          name: 'ステッカー数',
          value: `230`,
          inline: true
        },
        {
          name: '全メンバー数',
          value: `1500000`,
          inline: true
        },
        {
          name: '規模',
          value: '大規模',
          inline: true
        },
        {
          name: '管理の2要素認証',
          value: '2FAを要求する',
          inline: true
        },
        {
          name: 'NSFWレベル',
          value: '年齢制限',
          inline: true
        },
        {
          name: 'ブースト状況',
          value: 'ティア3',
          inline: true
        },
        {
          name: '認証レベル',
          value: '最高(電話番号認証要求)',
          inline: true
        },
        {
          name: '作成日時',
          value: `<t:20050>(<t:20050:R>)`,
          inline: true
        }
      ]
    });
    expect(fetchStats).toHaveBeenCalledOnce();
  });

  it('Fail GuildInfo', async () => {
    const fetchStats = vi.spyOn(repo, 'fetchGuildStats').mockImplementation(() => Promise.resolve(null));
    const fn = vi.fn();

    await guildInfo.on(
      createMockMessage(
        parseStringsOrThrow(['guildinfo'], guildInfo.schema),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: '取得エラー',
      description: '限界開発鯖の情報が見つからないみたい……'
    });
    expect(fetchStats).toHaveBeenCalledOnce();
  });
});
