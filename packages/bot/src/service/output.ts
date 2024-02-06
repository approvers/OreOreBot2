import type { Dep0 } from '../driver/dep-registry.js';
import type { EmbedMessage } from '../model/embed-message.js';

/**
 * "#無法地帯" に埋め込みを送信する interface.
 */
export interface StandardOutput {
  sendEmbed(embed: EmbedMessage): Promise<void>;
}
export interface StandardOutputDep extends Dep0 {
  type: StandardOutput;
}
export const standardOutputKey = Symbol(
  'STANDARD_OUTPUT'
) as unknown as StandardOutputDep;

/**
 * "#玄関" に埋め込みを送信する interface.
 */
export interface EntranceOutput {
  sendEmbedWithMention(embed: EmbedMessage, userId: string): Promise<void>;
}
