import { ChannelType, type Client } from 'discord.js';

import type { EmbedMessage } from '../../model/embed-message.js';
import type { EntranceOutput, StandardOutput } from '../../service/output.js';
import { convertEmbed } from '../embed-convert.js';

export class DiscordStandardOutput implements StandardOutput {
  constructor(
    private readonly client: Client,
    private readonly channelId: string
  ) {}

  async sendEmbed(embed: EmbedMessage): Promise<void> {
    const channel = await this.client.channels.fetch(this.channelId);
    if (!channel || channel.type !== ChannelType.GuildText) {
      throw new Error(`the channel (${this.channelId}) is not text channel`);
    }

    const made = convertEmbed(embed);
    await channel.send({
      embeds: [made]
    });
  }
}

export class DiscordEntranceOutput implements EntranceOutput {
  constructor(
    private readonly client: Client,
    private readonly channelId: string
  ) {}

  async sendEmbed(embed: EmbedMessage): Promise<void> {
    const channel = await this.client.channels.fetch(this.channelId);

    if (!channel || channel.type !== ChannelType.GuildText) {
      throw new Error(`the channel (${this.channelId}) is not text channel`);
    }

    const made = convertEmbed(embed);
    await channel.send({
      embeds: [made]
    });
  }

  async sendMention(userId: string): Promise<void> {
    const channel = await this.client.channels.fetch(this.channelId);

    if (!channel || channel.type !== ChannelType.GuildText) {
      throw new Error(`the channel (${this.channelId}) is not text channel`);
    }

    await channel.send(`<@${userId}>`);
  }
}
