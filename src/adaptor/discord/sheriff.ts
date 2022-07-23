import { ChannelType, Client } from 'discord.js';
import type { Sheriff } from '../../service/command/stfu.js';
import type { Snowflake } from '../../model/id.js';

export class DiscordSheriff implements Sheriff {
  constructor(private readonly client: Client) {}

  async executeMessage(
    channelId: Snowflake,
    historyRange: number
  ): Promise<void> {
    const harachoId = this.client.user?.id;
    if (!harachoId) throw new Error('haracho is not found');

    const channel = await this.client.channels.fetch(channelId);
    if (!channel) throw new Error(`channel: (${channelId}) not found`);
    if (channel.type !== ChannelType.GuildText)
      throw new Error('this channel is not text channel.');

    const messages = await channel.messages.fetch({ limit: historyRange });

    const targetMessage = messages.find(
      (message) => message.author.id === harachoId
    );
    if (!targetMessage) return;
    await targetMessage.delete();
  }
}
