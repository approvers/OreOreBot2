import {
  type APIActionRowComponent,
  type APIMessageActionRowComponent,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  Message,
  type MessageActionRowComponentBuilder
} from 'discord.js';
import type {
  CommandProxy,
  MessageCreateListener
} from '../../runner/command.js';
import { Schema, makeError } from '../../model/command-schema.js';
import type { EmbedPage } from '../../model/embed-message.js';
import type { RawMessage } from './middleware.js';
import type { Snowflake } from '../../model/id.js';
import { convertEmbed } from '../embed-convert.js';
import { parseStrings } from './command/schema.js';

const SPACES = /\s+/;

export class DiscordCommandProxy implements CommandProxy {
  constructor(client: Client, private readonly prefix: string) {
    client.on('messageCreate', (message) => this.onMessageCreate(message));
  }

  private readonly listenerMap = new Map<
    string,
    [Schema, MessageCreateListener]
  >();

  addMessageCreateListener(
    schema: Schema,
    listener: MessageCreateListener
  ): void {
    for (const name of schema.names) {
      if (this.listenerMap.has(name)) {
        throw new Error(`command name conflicted: ${name}`);
      }
      this.listenerMap.set(name, [schema, listener]);
    }
  }

  private async onMessageCreate(message: Message): Promise<void> {
    if (message.author.bot || message.author.system) {
      return;
    }
    await message.fetch();

    if (!message.content?.trimStart().startsWith(this.prefix)) {
      return;
    }
    const args = message.content
      ?.trim()
      .slice(this.prefix.length)
      .split(SPACES);

    const entry = this.listenerMap.get(args[0]);
    if (!entry) {
      return;
    }
    const [schema, listener] = entry;
    const [tag, parsedArgs] = parseStrings(args, schema);
    if (tag === 'Err') {
      const error = makeError(parsedArgs);
      await message.reply(error.message);
      return;
    }

    await listener({
      senderId: message.author.id as Snowflake,
      senderGuildId: message.guildId as Snowflake,
      senderChannelId: message.channelId as Snowflake,
      get senderVoiceChannelId(): Snowflake | null {
        const id = message.member?.voice.channelId ?? null;
        return id ? (id as Snowflake) : null;
      },
      senderName: message.author?.username ?? '名無し',
      args: parsedArgs,
      async reply(embed) {
        const mes = await message.reply({ embeds: [convertEmbed(embed)] });
        return {
          edit: async (embed) => {
            await mes.edit({ embeds: [convertEmbed(embed)] });
          }
        };
      },
      replyPages: replyPages(message),
      async react(emoji) {
        await message.react(emoji);
      }
    });
  }
}

const ONE_MINUTE_MS = 60_000;
const CONTROLS: APIActionRowComponent<APIMessageActionRowComponent> =
  new ActionRowBuilder<MessageActionRowComponentBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('prev')
        .setLabel('戻る')
        .setEmoji('⏪'),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('next')
        .setLabel('進む')
        .setEmoji('⏩')
    )
    .toJSON();
const CONTROLS_DISABLED: APIActionRowComponent<APIMessageActionRowComponent> =
  new ActionRowBuilder<MessageActionRowComponentBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('prev')
        .setLabel('戻る')
        .setEmoji('⏪')
        .setDisabled(true),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('next')
        .setLabel('進む')
        .setEmoji('⏩')
        .setDisabled(true)
    )
    .toJSON();

const pagesFooter = (currentPage: number, pagesLength: number) =>
  `ページ ${currentPage + 1}/${pagesLength}`;

const replyPages = (message: RawMessage) => async (pages: EmbedPage[]) => {
  if (pages.length === 0) {
    throw new Error('pages must not be empty array');
  }

  const generatePage = (index: number) =>
    convertEmbed(pages[index]).setFooter({
      text: pagesFooter(index, pages.length)
    });

  const paginated = await message.reply({
    embeds: [generatePage(0)],
    components: [CONTROLS]
  });

  const collector = paginated.createMessageComponentCollector({
    time: ONE_MINUTE_MS
  });

  let currentPage = 0;
  collector.on('collect', async (interaction) => {
    switch (interaction.customId) {
      case 'prev':
        if (0 < currentPage) {
          currentPage -= 1;
        } else {
          currentPage = pages.length - 1;
        }
        break;
      case 'next':
        if (currentPage < pages.length - 1) {
          currentPage += 1;
        } else {
          currentPage = 0;
        }
        break;
      default:
        return;
    }
    await interaction.update({ embeds: [generatePage(currentPage)] });
  });
  collector.on('end', async () => {
    await paginated.edit({ components: [CONTROLS_DISABLED] });
  });
};
