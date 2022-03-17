import type { EmbedMessage } from '../model/embed-message';

export interface StandardOutput {
  sendEmbed(embed: EmbedMessage): Promise<void>;
}
