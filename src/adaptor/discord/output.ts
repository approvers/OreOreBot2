import { ChannelType, type Client, EmbedBuilder } from 'discord.js';
import type { EmbedMessage } from '../../model/embed-message.js';
import type { StandardOutput } from '../../service/output.js';

export class DiscordOutput implements StandardOutput {
  constructor(
    private readonly client: Client,
    private readonly channelId: string
  ) {}

  async sendEmbed(embed: EmbedMessage): Promise<void> {
    const channel = await this.client.channels.fetch(this.channelId);
    if (!channel || channel.type !== ChannelType.GuildText) {
      throw new Error(`the channel (${this.channelId}) is not text channel`);
    }

    const made = buildEmbed(embed);
    await channel.send({
      embeds: [made]
    });
  }
}

function buildEmbed(embed: EmbedMessage) {
  const makeEmbed = new EmbedBuilder();
  const { title, color, description, fields, url, footer, thumbnail, author } =
    embed;
  if (author) {
    makeEmbed.setAuthor({ name: author.name, iconURL: author.iconUrl });
  }
  if (color) {
    makeEmbed.setColor(color);
  }
  if (description) {
    makeEmbed.setDescription(description);
  }
  if (fields) {
    makeEmbed.setFields(fields);
  }
  if (footer) {
    makeEmbed.setFooter({ text: footer });
  }
  if (title) {
    makeEmbed.setTitle(title);
  }
  if (url) {
    makeEmbed.setURL(url);
  }
  if (thumbnail) {
    makeEmbed.setThumbnail(thumbnail.url);
  }
  return makeEmbed;
}
