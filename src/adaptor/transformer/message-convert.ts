import type { Transformer, RawMessage } from '.';
import type { CommandMessage } from '../../service/command-message';
import type { DeletionObservable } from '../../service/deletion-repeater';
import type { EditingObservable } from '../../service/difference-detector';
import type { MessageHandler } from '..';
import type { Snowflake } from '../../model/id';
import type { TypoObservable } from '../../service/typo-record';
import { convertEmbed } from '../embed-convert';

const getAuthorSnowflake = (message: RawMessage): Snowflake =>
  (message.author?.id || 'unknown') as Snowflake;

const observableMessage = (
  raw: RawMessage
): EditingObservable & DeletionObservable & TypoObservable => ({
  authorId: getAuthorSnowflake(raw),
  author: raw.author?.username || '名無し',
  content: raw.content || '',
  async sendToSameChannel(message: string): Promise<void> {
    await raw.channel.send(message);
  }
});

export const observableTransformer: Transformer<
  EditingObservable & DeletionObservable & TypoObservable,
  RawMessage
> = (handler) => (raw: RawMessage) => handler(observableMessage(raw));

const SPACES = /\s+/;

export const converterWithPrefix =
  (prefix: string): Transformer<CommandMessage, RawMessage> =>
  (func: MessageHandler<CommandMessage>) =>
  async (message: RawMessage): Promise<void> => {
    if (!message.content?.trimStart().startsWith(prefix)) {
      return;
    }
    const args = message.content?.trim().slice(prefix.length).split(SPACES);
    const command: CommandMessage = {
      senderId: getAuthorSnowflake(message),
      senderGuildId: message.guildId as Snowflake,
      get senderVoiceChannelId(): Snowflake | null {
        const id = message.member?.voice.channelId ?? null;
        return id ? (id as Snowflake) : null;
      },
      senderName: message.author?.username ?? '名無し',
      args,
      async reply(embed) {
        await message.reply({ embeds: [convertEmbed(embed)] });
      }
    };
    await func(command);
  };
