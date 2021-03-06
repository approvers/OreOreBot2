import {
  APIActionRowComponent,
  APIMessageActionRowComponent,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder
} from 'discord.js';
import type { RawMessage, Transformer } from '../transformer.js';
import type { BoldItalicCop } from '../../../service/bold-italic-cop.js';
import type { CommandMessage } from '../../../service/command/command-message.js';
import type { DeletionObservable } from '../../../service/deletion-repeater.js';
import type { EditingObservable } from '../../../service/difference-detector.js';
import type { EmbedPage } from '../../../model/embed-message.js';
import type { EmojiSeqObservable } from '../../../service/emoji-seq-react.js';
import type { MessageHandler } from '../../index.js';
import type { Snowflake } from '../../../model/id.js';
import type { TypoObservable } from '../../../service/command/typo-record.js';
import { convertEmbed } from '../../embed-convert.js';

const getAuthorSnowflake = (message: RawMessage): Snowflake =>
  (message.author?.id || 'unknown') as Snowflake;

const fetchMessage = async (message: RawMessage) => {
  await message.fetch().catch(() => {
    // 取得に失敗した場合は既に削除されたかアクセスできない可能性が高いため、エラーは無視します。
    // 実際に削除されたメッセージに対しては、`fetch` に失敗するもののキャッシュが残っているため引き続き動作可能です。
  });
};

const observableMessage = (
  raw: RawMessage
): EditingObservable &
  DeletionObservable &
  TypoObservable &
  BoldItalicCop &
  EmojiSeqObservable => ({
  authorId: getAuthorSnowflake(raw),
  author: raw.author?.username || '名無し',
  content: raw.content || '',
  async sendToSameChannel(message: string): Promise<void> {
    await raw.channel.send(message);
  },
  async replyMessage(message): Promise<void> {
    await raw.reply(message);
  },
  async addReaction(reaction): Promise<void> {
    await raw.react(reaction);
  }
});

export const observableTransformer: Transformer<
  EditingObservable &
    DeletionObservable &
    TypoObservable &
    BoldItalicCop &
    EmojiSeqObservable,
  RawMessage
> = (handler) => async (raw: RawMessage) => {
  await fetchMessage(raw);
  if (raw.content === null || raw.content === '') {
    return;
  }
  return handler(observableMessage(raw));
};

const SPACES = /\s+/;
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

export const converterWithPrefix =
  (prefix: string): Transformer<CommandMessage, RawMessage> =>
  (func: MessageHandler<CommandMessage>) =>
  async (message: RawMessage): Promise<void> => {
    await fetchMessage(message);
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
      args,
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
    };
    await func(command);
  };
