import { ChannelType, Client } from 'discord.js';
import type { Sheriff } from '../../service/command/stfu.js';
import type { Snowflake } from '../../model/id.js';

export class DiscordSheriff implements Sheriff {
  private queue: (() => void)[] = [];

  constructor(private readonly client: Client) {
    setInterval(() => {
      const first = this.queue.shift();
      if (!first) {
        return;
      }
      first();
    }, 500);
  }

  executeMessage(channelId: Snowflake, historyRange: number): Promise<void> {
    this.queue.push(
      () => void this.innerExecuteMessage(channelId, historyRange)
    );
    return Promise.resolve();
  }

  private async innerExecuteMessage(
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
