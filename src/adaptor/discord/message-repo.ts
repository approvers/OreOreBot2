import type { Client } from 'discord.js';
import type { MessageRepository } from '../../service/debug.js';
import type { Snowflake } from '../../model/id.js';

export class DiscordMessageRepository implements MessageRepository {
  constructor(private readonly client: Client) {}

  async getMessageContent(
    channelId: Snowflake,
    messageId: Snowflake
  ): Promise<string | undefined> {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel || !channel.isText()) {
      throw new Error(`text channel (${channelId}) not found`);
    }
    try {
      const message = await channel.messages.fetch(messageId);
      return message.content || '';
    } catch (e) {
      return undefined;
    }
  }
}
