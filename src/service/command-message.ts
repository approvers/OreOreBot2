import type { EmbedMessage, EmbedPage } from '../model/embed-message.js';
import type { MessageEventResponder } from '../runner/index.js';
import type { Snowflake } from '../model/id.js';

/**
 * コマンド形式のメッセージの抽象。
 *
 * @export
 * @interface CommandMessage
 */
export interface CommandMessage {
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
   * コマンドの引数リスト。
   *
   * @type {readonly string[]}
   * @memberof CommandMessage
   */
  args: readonly string[];

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

export type CommandResponder = MessageEventResponder<CommandMessage> & {
  help: Readonly<HelpInfo>;
};

export const createMockMessage = (
  partial: Readonly<Partial<CommandMessage>>,
  reply?: (message: EmbedMessage) => Promise<SentMessage | void>
): CommandMessage => ({
  senderId: '279614913129742338' as Snowflake,
  senderGuildId: '683939861539192860' as Snowflake,
  senderChannelId: '711127633810817026' as Snowflake,
  senderVoiceChannelId: '683939861539192865' as Snowflake,
  senderName: 'Mikuroさいな',
  args: [],
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
