import type { EmbedMessage } from '../model/embed-message.js';

export interface StandardOutput {
  sendEmbed(embed: EmbedMessage): Promise<void>;
}
