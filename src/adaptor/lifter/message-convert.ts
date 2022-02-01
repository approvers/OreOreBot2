import { Lifter, RawMessage } from '.';
import type { CommandMessage } from '../../service/command-message';
import type { DeletionObservable } from '../../service/deletion-repeater';
import type { EditingObservable } from '../../service/difference-detector';
import { Snowflake } from '../../model/id';
import type { TypoObservable } from '../../service/typo-record';
import { convertEmbed } from '../embed-convert';
import { MessageHandler } from '..';

const getAuthorSnowflake = (message: RawMessage): Snowflake =>
  (message.author?.id || 'unknown') as Snowflake;

export const observableMessage = (
  raw: RawMessage
): EditingObservable & DeletionObservable & TypoObservable => ({
  authorId: getAuthorSnowflake(raw),
  author: raw.author?.username || '名無し',
  content: raw.content || '',
  async sendToSameChannel(message: string): Promise<void> {
    await raw.channel.send(message);
  }
});

export const observableLifter: Lifter<
  EditingObservable & DeletionObservable & TypoObservable,
  RawMessage
> = (handler) => (raw: RawMessage) => handler(observableMessage(raw));

const SPACES = /\s+/;

export const converterWithPrefix =
  (prefix: string): Lifter<CommandMessage, RawMessage> =>
  (func: MessageHandler<CommandMessage>) =>
  async (message: RawMessage): Promise<void> => {
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
  };
