import { EmbedBuilder } from 'discord.js';
import type { EmbedMessage } from '../model/embed-message.js';

export const convertEmbed = ({
  author,
  color,
  description,
  fields,
  footer,
  title,
  thumbnail,
  url
}: EmbedMessage): EmbedBuilder => {
  const embed = new EmbedBuilder();
  if (author) {
    embed.setAuthor({
      name: author.name,
      url: author.url,
      iconURL: author.iconUrl
    });
  }
  if (color) {
    embed.setColor(color);
  }
  if (description) {
    embed.setDescription(description);
  }
  if (fields) {
    embed.setFields(fields);
  }
  if (footer) {
    embed.setFooter({
      text: footer
    });
  }
  if (title) {
    embed.setTitle(title);
  }
  if (thumbnail) {
    embed.setThumbnail(thumbnail.url);
  }
  if (url) {
    embed.setURL(url);
  }
  return embed;
};
