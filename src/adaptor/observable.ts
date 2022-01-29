import type { Message } from 'discord.js';
import type { DeletionObservable } from '../service/deletion-repeater';
import type { EditingObservable } from '../service/editing-observer';

export const deletionObservableMessage = (
  raw: Message
): DeletionObservable => ({
  author: raw.author.username,
  content: raw.content,
  async sendToSameChannel(message: string): Promise<void> {
    await raw.channel.send(message);
  }
});

export const editingObservableMessage = (
  before: Message,
  after: Message
): EditingObservable => ({
  before: before.content,
  after: after.content,
  async sendToSameChannel(message: string): Promise<void> {
    await after.channel.send(message);
  }
});
