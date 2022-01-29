import type { Message } from 'discord.js';
import type { DeletionObservable } from '../service/deletion-repeater';

export const deletionObservableMessage = (
  raw: Message
): DeletionObservable => ({
  author: raw.author.username,
  content: raw.content,
  async sendToSameChannel(message: string): Promise<void> {
    await raw.channel.send(message);
  }
});
