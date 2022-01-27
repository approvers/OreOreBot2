import { VoiceChannelParticipant } from '../server/service/VoiceDiff';
import { EmbedMessage } from '../model/EmbedMessage';
import { MessageEmbed, TextBasedChannel, VoiceState } from 'discord.js';

export class DiscordParticipant implements VoiceChannelParticipant {
  constructor(
    private voiceState: VoiceState,
    private sendChannel: TextBasedChannel
  ) {}

  get userName(): string {
    return this.voiceState.member?.displayName ?? '名無し';
  }

  get userAvatar(): string {
    const avatarURL = this.voiceState.member?.displayAvatarURL();
    if (!avatarURL) {
      throw new Error('アバターが取得できませんでした。');
    }
    return avatarURL;
  }

  get channelName(): string {
    return this.voiceState.channel?.name ?? '名無し';
  }

  async sendEmbed(embed: EmbedMessage): Promise<void> {
    const makeEmbed = new MessageEmbed();
    const {
      title,
      color,
      description,
      fields,
      url,
      footer,
      thumbnail,
      author
    } = embed;
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
    await this.sendChannel.send({
      embeds: [makeEmbed]
    });
  }
}
