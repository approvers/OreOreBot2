import type { Message } from 'discord.js';
import type { DeletionObservable } from '../service/deletion-repeater';
import type { EditingObservable } from '../service/editing-observer';

export const observableMessage = (
  raw: Message
): EditingObservable & DeletionObservable => ({
  author: raw.author.username,
  content: raw.content,
  async sendToSameChannel(message: string): Promise<void> {
    await raw.channel.send(message);
  }
});
