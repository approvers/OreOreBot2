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
  sendEmbed(embed: EmbedMessage): Promise<void>;

  // note: メンションとともに送信したいため
  sendEmbedWithMention(embed: EmbedMessage, userId: string): Promise<void>;
}
