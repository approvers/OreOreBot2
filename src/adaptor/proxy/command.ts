import {
  type APIActionRowComponent,
  type APIMessageActionRowComponent,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  Message,
  type MessageActionRowComponentBuilder,
  type Interaction,
  type MessageReplyOptions,
  InteractionResponse,
  type InteractionReplyOptions
} from 'discord.js';

import { type Schema, makeError } from '../../model/command-schema.js';
import type { EmbedPage } from '../../model/embed-message.js';
import { type Snowflake, unknownId } from '../../model/id.js';
import type {
  CommandProxy,
  MessageCreateListener
} from '../../runner/command.js';
import type { ReplyPagesOptions } from '../../service/command/command-message.js';
import { convertEmbed } from '../embed-convert.js';
import { parseStrings } from './command/schema.js';
import { parseOptions } from './command/slash.js';
import type { RawMessage } from './middleware.js';

const SPACES = /\s+/;

export class DiscordCommandProxy implements CommandProxy {
  constructor(
    client: Client,
    private readonly prefix: string
  ) {
    client.on('messageCreate', (message) => this.onMessageCreate(message));
    client.on('interactionCreate', (interaction) =>
      this.onInteractionCreate(interaction)
    );
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

    if (!message.content.trimStart().startsWith(this.prefix)) {
      return;
    }
    const args = message.content.trim().slice(this.prefix.length).split(SPACES);

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
      senderName: message.author.username,
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

  private async onInteractionCreate(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) {
      return;
    }
    const entry = this.listenerMap.get(interaction.commandName);
    if (!entry) {
      return;
    }

    await interaction.deferReply();

    const [schema, listener] = entry;

    const [tag, parsedArgs] = parseOptions(
      interaction.commandName,
      interaction.options,
      schema
    );
    if (tag === 'Err') {
      const error = makeError(parsedArgs);
      await interaction.editReply(error.message);
      return;
    }

    await listener({
      senderId: interaction.user.id as Snowflake,
      senderGuildId: (interaction.guild?.id ?? unknownId) as Snowflake,
      senderChannelId: (interaction.channel?.id ?? unknownId) as Snowflake,
      get senderVoiceChannelId(): Snowflake | null {
        if (!interaction.inCachedGuild()) {
          return null;
        }
        const id = interaction.member.voice.channelId ?? null;
        return id ? (id as Snowflake) : null;
      },
      senderName: interaction.user.username,
      args: parsedArgs,
      async reply(embed) {
        const mes = await interaction.editReply({
          embeds: [convertEmbed(embed)]
        });
        return {
          async edit(embed) {
            await mes.edit({ embeds: [convertEmbed(embed)] });
          }
        };
      },
      replyPages: replyPages(interaction),
      async react() {
        // cannot react emoji to the slash command
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

const replyPages =
  (message: {
    reply:
      | ((options: InteractionReplyOptions) => Promise<InteractionResponse>)
      | ((options: MessageReplyOptions) => Promise<RawMessage>);
  }) =>
  async (pages: EmbedPage[], options?: ReplyPagesOptions) => {
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

    const isLimitedToPaginate = options?.usersCanPaginate !== undefined;

    let currentPage = 0;
    collector.on('collect', async (interaction) => {
      if (
        isLimitedToPaginate &&
        !options.usersCanPaginate.includes(interaction.user.id as Snowflake)
      ) {
        return;
      }

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
