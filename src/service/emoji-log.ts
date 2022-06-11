import type { EmojiEventResponder, RoleEvent } from '../runner/index.js';
import type { StandardOutput } from './output.js';

export interface EmojiData {
  emoji: string;
  emojiAuthorId: string | undefined;
}

export class EmojiLog implements EmojiEventResponder<EmojiData> {
  constructor(private readonly output: StandardOutput) {}
  async on(event: RoleEvent, role: EmojiData): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }

    if (role.emojiAuthorId == undefined) {
      await this.output.sendEmbed({
        title: '絵文字警察',
        description: `誰かが ${role.emoji} を作成しました`
      });
      return;
    }

    await this.output.sendEmbed({
      title: '絵文字警察',
      description: `<@${role.emojiAuthorId}> が ${role.emoji} を作成しました`
    });
  }
}
