import { EmbedBuilder } from 'discord.js';

import type { EmbedMessage } from '../model/embed-message.js';

// はらちょのパーソナルカラー
// https://github.com/approvers/OreOreBot2/issues/675
export const PERSONAL_COLOR = 0x00b7c4;

export const convertEmbed = ({
  author,
  description,
  fields,
  footer,
  title,
  thumbnail,
  url,
  color
}: EmbedMessage): EmbedBuilder => {
  const embed = new EmbedBuilder();
  if (author) {
    embed.setAuthor({
      name: author.name,
      url: author.url,
      iconURL: author.iconUrl
    });
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
  embed.setColor(color ?? PERSONAL_COLOR);
  return embed;
};
