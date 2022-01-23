import type { Message } from 'discord.js';
import type { Observable } from '../service/deletion-repeater';

export const observableMessage = (raw: Message): Observable => ({
  author: raw.author.username,
  content: raw.content,
  async sendToSameChannel(message: string): Promise<void> {
    await raw.channel.send(message);
  }
});
