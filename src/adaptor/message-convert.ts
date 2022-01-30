import { Lifter, lifterFromMap } from '.';
import { Message, PartialMessage } from 'discord.js';
import type { CommandMessage } from '../service/command-message';
import type { DeletionObservable } from '../service/deletion-repeater';
import type { EditingObservable } from '../service/difference-detector';
import { Snowflake } from '../model/id';
import type { TypoObservable } from '../service/typo-record';
import { convertEmbed } from './embed-convert';

const getAuthorSnowflake = (message: Message | PartialMessage): Snowflake =>
  (message.author?.id || 'unknown') as Snowflake;

export const observableMessage = (
  raw: Message | PartialMessage
): EditingObservable & DeletionObservable & TypoObservable => ({
  authorId: getAuthorSnowflake(raw),
  author: raw.author?.username || '名無し',
  content: raw.content || '',
  async sendToSameChannel(message: string): Promise<void> {
    await raw.channel.send(message);
  }
});

export const observableLifter: Lifter<
  EditingObservable & DeletionObservable & TypoObservable
> = lifterFromMap(observableMessage);

const SPACES = /\s+/;

export const converterWithPrefix = (
  prefix: string
): Lifter<CommandMessage> => ({
  lift:
    (func: (command: CommandMessage) => Promise<void>) =>
    async (message: Message | PartialMessage): Promise<void> => {
      if (!message.content?.trimStart().startsWith(prefix)) {
        return;
      }
      const args = message.content?.trim().slice(prefix.length).split(SPACES);
      const command: CommandMessage = {
        sender: getAuthorSnowflake(message),
        args,
        async reply(embed) {
          await message.reply({ embeds: [convertEmbed(embed)] });
        }
      };
      await func(command);
    }
});
