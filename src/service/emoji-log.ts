import { EmojiEventResponder, RoleEvent } from '../runner';
import { type Emoji } from 'discord.js';
import { StandardOutput } from './output';

export interface RoleData {
  emoji: Emoji;
  emojiAuthorId: string;
}

export class EmojiLog implements EmojiEventResponder<RoleData> {
  constructor(private readonly output: StandardOutput) {}
  async on(event: RoleEvent, role: RoleData): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }

    /**
     * emojiオブジェクトをtoString()することで、絵文字として送信できるものに変換できる
     */
    await this.output.sendEmbed({
      title: '絵文字作成',
      description: `<@${
        role.emojiAuthorId
      }> が ${role.emoji.toString()} を作成しました`
    });
  }
}
