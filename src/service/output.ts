import type { EmbedMessage } from '../model/embed-message.js';

/**
 * "#無法地帯" に埋め込みを送信する interface.
 */
export interface StandardOutput {
  sendEmbed(embed: EmbedMessage): Promise<void>;
}

/**
 * "#玄関" に埋め込みを送信する interface.
 */
export interface EntranceOutput {
  // 玄関でメンションを送信する
  sendMention(userId: string): Promise<void>;
  sendEmbed(embed: EmbedMessage): Promise<void>;
}
