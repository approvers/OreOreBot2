import type { Client, GuildBasedChannel } from 'discord.js';

import type { ChannelStats, ChannelType } from '../../model/channel.js';
import type { Snowflake } from '../../model/id.js';
import type { ChannelStatsRepository } from '../../service/command/channel-info.js';

const mappingChannelTypes: Record<GuildBasedChannel['type'], ChannelType> = {
  0: 'テキストチャンネル',
  2: 'ボイスチャンネル',
  4: 'カテゴリー',
  5: 'アナウンスチャンネル',
  10: 'アナウンスチャンネル(スレッド)',
  11: '公開スレッド(パブリックスレッド)',
  12: '非公開スレッド(プライベートスレッド)',
  13: 'ステージチャンネル',
  15: 'フォーラムチャンネル'
};

export class DiscordChannelManager implements ChannelStatsRepository {
  constructor(
    private readonly client: Client,
    private readonly guildId: Snowflake
  ) {}

  async fetchStats(channelId: string): Promise<ChannelStats | null> {
    const guild = await this.client.guilds.fetch(this.guildId);
    if (!guild.available) {
      throw new Error('guild unavailable');
    }

    const channel = await guild.channels.fetch(channelId);
    if (!channel) {
      return null;
    }

    return {
      name: channel.name,
      createAt: channel.createdAt ?? undefined,
      url: channel.url,
      type: mappingChannelTypes[channel.type],
      manageable: channel.manageable,
      viewable: channel.viewable
    };
  }
}
