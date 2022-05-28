import { EmojiEventResponder, RoleEvent } from '../runner';
import { StandardOutput } from './output';

export interface EmojiData {
  emoji: string;
  emojiAuthorId: string;
}

export class EmojiLog implements EmojiEventResponder<EmojiData> {
  constructor(private readonly output: StandardOutput) {}
  async on(event: RoleEvent, role: EmojiData): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }

    await this.output.sendEmbed({
      title: '絵文字警察',
      description: `<@${role.emojiAuthorId}> が ${role.emoji} を作成しました`
    });
  }
}
