import type { Message, PartialMessage } from 'discord.js';
import { Lifter, lifterFromMap } from '.';
import type { Snowflake } from '../model/id';
import type { DeletionObservable } from '../service/deletion-repeater';
import type { EditingObservable } from '../service/difference-detector';
import type { TypoObservable } from '../service/typo-record';

export const observableMessage = (
  raw: Message | PartialMessage
): EditingObservable & DeletionObservable & TypoObservable => ({
  id: (raw.author?.id || 'unknown') as Snowflake,
  author: raw.author?.username || '名無し',
  content: raw.content || '',
  async sendToSameChannel(message: string): Promise<void> {
    await raw.channel.send(message);
  }
});

export const observableLifter: Lifter<
  EditingObservable & DeletionObservable & TypoObservable
> = lifterFromMap(observableMessage);
