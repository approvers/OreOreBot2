import { VoiceRoomEvent, VoiceRoomEventResponder } from '../runner';
import { EmbedMessage } from '../model/embed-message';

export interface VoiceChannelParticipant {
  userName: string;
  userAvatar: string;
  channelName: string;
}

export interface StandardOutput {
  sendEmbed(embed: EmbedMessage): Promise<void>;
}

export class VoiceDiff
  implements VoiceRoomEventResponder<VoiceChannelParticipant>
{
  constructor(private readonly stdout: StandardOutput) {}

  async on(
    event: VoiceRoomEvent,
    voiceState: VoiceChannelParticipant
  ): Promise<void> {
    if (event === 'JOIN') {
      // VoiceChannel 入室時
      const { userName, userAvatar, channelName } = voiceState;
      await this.stdout.sendEmbed({
        title: userName + 'が' + channelName + 'に入りました',
        description: '何かが始まる予感がする。',
        color: 0x1e63e9,
        author: { name: 'はらちょからのお知らせ' },
        thumbnail: { url: userAvatar }
      });
    }
    if (event === 'LEAVE') {
      // VoiceChannel 退出時
      const { userName, userAvatar, channelName } = voiceState;
      await this.stdout.sendEmbed({
        title: userName + 'が' + channelName + 'から抜けました',
        description: 'あいつは良い奴だったよ...',
        color: 0x1e63e9,
        author: { name: 'はらちょからのお知らせ' },
        thumbnail: { url: userAvatar }
      });
    }
  }
}
