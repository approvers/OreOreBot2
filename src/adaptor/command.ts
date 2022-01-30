import type { Message, PartialMessage } from 'discord.js';
import { Lifter } from '.';
import type { Snowflake } from '../model/id';
import type { CommandMessage } from '../service/command-message';
import { convertEmbed } from './embed-convert';

const SPACES = /\s/;

export const converterWithPrefix = (
  prefix: string
): Lifter<CommandMessage> => ({
  lift:
    (func: (command: CommandMessage) => Promise<void>) =>
    async (message: Message | PartialMessage): Promise<void> => {
      if (!message.content?.trimStart().startsWith(prefix)) {
        return;
      }
      const args = message.content
        ?.trim()
        .slice(prefix.length)
        .split(SPACES)
        .filter((arg) => arg !== '');
      const command: CommandMessage = {
        sender: (message.author?.id || 'unknown') as Snowflake,
        args,
        async reply(embed) {
          await message.reply({ embeds: [convertEmbed(embed)] });
        }
      };
      await func(command);
    }
});
