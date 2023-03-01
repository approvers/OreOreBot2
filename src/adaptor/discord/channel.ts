import type { Client, GuildBasedChannel } from 'discord.js';

import type { ChannelStats, ChannelType } from '../../model/channel.js';
import type { Snowflake } from '../../model/id.js';
import type { ChannelStatsRepository } from '../../service/command/channel-info.js';

const mappingChannelTypes: Record<GuildBasedChannel['type'], ChannelType> = {
  0: 'Text',
  2: 'Voice',
  4: 'Category',
  5: 'Announce',
  10: 'Announce(Thread)',
  11: 'Thread(Public)',
  12: 'Thread(Private)',
  13: 'Stage',
  15: 'Forum'
};

export class DiscordChannelRepository implements ChannelStatsRepository {
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
      createdAt: channel.createdAt ?? undefined,
      url: channel.url,
      type: mappingChannelTypes[channel.type]
    };
  }
}
