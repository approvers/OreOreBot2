import type { RawMessage, Transformer } from '.';
import type { BoldItalicCop } from '../../service/bold-italic-cop';
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
): EditingObservable & DeletionObservable & TypoObservable & BoldItalicCop => ({
  authorId: getAuthorSnowflake(raw),
  author: raw.author?.username || '名無し',
  content: raw.content || '',
  async sendToSameChannel(message: string): Promise<void> {
    await raw.channel.send(message);
  },
  async replyMessage(message): Promise<void> {
    await raw.reply(message);
  }
});

export const observableTransformer: Transformer<
  EditingObservable & DeletionObservable & TypoObservable & BoldItalicCop,
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
      senderChannelId: message.channelId as Snowflake,
      get senderVoiceChannelId(): Snowflake | null {
        const id = message.member?.voice.channelId ?? null;
        return id ? (id as Snowflake) : null;
      },
      senderName: message.author?.username ?? '名無し',
      timestamp: message.createdTimestamp,
      args,
      async reply(embed) {
        const mes = await message.reply({ embeds: [convertEmbed(embed)] });
        return {
          edit: async (embed) => {
            await mes.edit({ embeds: [convertEmbed(embed)] });
          }
        };
      },
      async react(emoji) {
        await message.react(emoji);
      }
    };
    await func(command);
  };
