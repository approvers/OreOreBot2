import type {
  VoiceRoomEvent,
  VoiceRoomEventResponder
} from '../runner/index.js';
import type { StandardOutput } from './output.js';

export interface VoiceChannelParticipant {
  userName: string;
  userAvatar: string;
  channelName: string;
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
        author: { name: 'はらちょからのお知らせ' },
        thumbnail: { url: userAvatar }
      });
    }
  }
}
