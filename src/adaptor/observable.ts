import type { Message, PartialMessage } from 'discord.js';
import type { DeletionObservable } from '../service/deletion-repeater';
import type { EditingObservable } from '../service/difference-detector';

export const observableMessage = (
  raw: Message | PartialMessage
): EditingObservable & DeletionObservable => ({
  author: raw.author?.username || '名無し',
  content: raw.content || '',
  async sendToSameChannel(message: string): Promise<void> {
    await raw.channel.send(message);
  }
});
