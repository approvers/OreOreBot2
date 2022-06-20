import type { VoiceChannelParticipant } from '../../service/voice-diff.js';
import type { VoiceState } from 'discord.js';

export class DiscordParticipant implements VoiceChannelParticipant {
  constructor(private voiceState: VoiceState) {}

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
}
