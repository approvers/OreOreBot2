import type { EmbedMessage, EmbedPage } from '../../model/embed-message.js';
import type { ParsedSchema, Schema } from '../../model/command-schema.js';

import type { MessageEventResponder } from '../../runner/index.js';
import type { Snowflake } from '../../model/id.js';

/**
 * コマンド形式のメッセージの抽象。
 *
 * @export
 * @interface CommandMessage
 * @template S スキーマの型
 */
export interface CommandMessage<S extends Schema<Record<string, never>>> {
  /**
   * コマンドの送信者の ID。
   *
   * @type {Snowflake}
   * @memberof CommandMessage
   */
  senderId: Snowflake;

  /**
   * コマンドの送信者の所属サーバの ID。
   *
   * @type {Snowflake}
   * @memberof CommandMessage
   */
  senderGuildId: Snowflake;

  /**
   * コマンドの送信者が発信したチャンネルのID。
   *
   * @type {Snowflake}
   * @memberOf CommandMessage
   */
  senderChannelId: Snowflake;

  /**
   * コマンドの送信者が接続しているボイスチャンネルの ID。
   *
   * @type {Snowflake}
   * @memberof CommandMessage
   */
  senderVoiceChannelId: Snowflake | null;

  /**
   * コマンドの送信者の名前。
   *
   * @type {string}
   * @memberof CommandMessage
   */
  senderName: string;

  /**
   * パースされたコマンドの引数。
   *
   * @type {Readonly<ParsedSchema<S>>}
   * @memberof CommandMessage
   */
  args: Readonly<ParsedSchema<S>>;

  /**
   * このメッセージに `message` の内容で返信する。
   *
   * @param message
   * @memberof CommandMessage
   */
  reply(message: EmbedMessage): Promise<SentMessage>;

  /**
   * このメッセージにページ送りできる `pages` で返信する。
   *
   * @param pages
   * @memberof CommandMessage
   */
  replyPages(pages: EmbedPage[]): Promise<void>;

  /**
   * このメッセージに `emoji` の絵文字でリアクションする。
   *
   * @param emoji
   * @memberof CommandMessage
   */
  react(emoji: string): Promise<void>;
}

/**
 * すでに送信したメッセージ.
 */
export interface SentMessage {
  edit(newMessage: EmbedMessage): Promise<void>;
}

export interface HelpInfo {
  title: string;
  description: string;
  commandName: string[];
  argsFormat: {
    name: string;
    description: string;
    defaultValue?: string;
  }[];
}

export type CommandResponder<S extends Schema<Record<string, never>>> =
  MessageEventResponder<S> & {
    help: Readonly<HelpInfo>;
    schema: Readonly<S>;
  };

export const createMockMessage = <S extends Schema<Record<string, never>>>(
  args: Readonly<ParsedSchema<S>>,
  partial: Readonly<Partial<CommandMessage<S>>>,
  reply?: (message: EmbedMessage) => Promise<SentMessage | void>
): CommandMessage<S> => ({
  senderId: '279614913129742338' as Snowflake,
  senderGuildId: '683939861539192860' as Snowflake,
  senderChannelId: '711127633810817026' as Snowflake,
  senderVoiceChannelId: '683939861539192865' as Snowflake,
  senderName: 'Mikuroさいな',
  args,
  reply: reply
    ? async (mes) =>
        (await reply(mes)) || {
          edit: () => Promise.resolve()
        }
    : () =>
        Promise.resolve({
          edit: () => Promise.resolve()
        }),
  replyPages: () => Promise.resolve(),
  react: () => Promise.resolve(),
  ...partial
});
