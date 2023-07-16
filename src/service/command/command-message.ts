import type { ParsedSchema, Schema } from '../../model/command-schema.js';
import type { EmbedMessage, EmbedPage } from '../../model/embed-message.js';
import type { Snowflake } from '../../model/id.js';

/**
 * `CommandMessage.replyPages` のオプション。
 */
export interface ReplyPagesOptions {
  /**
   * ページネーションのボタンを操作できるユーザの ID のリスト。
   */
  readonly usersCanPaginate?: readonly Snowflake[];
}

/**
 * コマンド形式のメッセージの抽象。
 *
 * @typeParam S - スキーマの型
 */
export interface CommandMessage<S extends Schema> {
  /**
   * コマンドの送信者の ID。
   */
  senderId: Snowflake;

  /**
   * コマンドの送信者の所属サーバの ID。
   */
  senderGuildId: Snowflake;

  /**
   * コマンドの送信者が発信したチャンネルのID。
   */
  senderChannelId: Snowflake;

  /**
   * コマンドの送信者が接続しているボイスチャンネルの ID。
   */
  senderVoiceChannelId: Snowflake | null;

  /**
   * コマンドの送信者の名前。
   */
  senderName: string;

  /**
   * パースされたコマンドの引数。
   */
  args: Readonly<ParsedSchema<S>>;

  /**
   * このメッセージに `message` の内容で返信する。
   *
   * @param message - 返信内容の Embed メッセージ
   */
  reply(message: EmbedMessage): Promise<SentMessage>;

  /**
   * このメッセージにページ送りできる `pages` で返信する。
   *
   * @param pages - 返信内容の Embed ページのリスト
   */
  replyPages(pages: EmbedPage[], options?: ReplyPagesOptions): Promise<void>;

  /**
   * このメッセージに `emoji` の絵文字でリアクションする。
   *
   * @param emoji - リアクションする絵文字
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
  /**
   * はらちょドキュメントサイト(haracho.approvers.dev):
   * 各コマンドリファレンスのページ名を指定する。
   * 例: !ping コマンドのリファレンスが `haracho.approvers.dev/commands/ping` にある場合は `ping` を docId に指定する。
   */
  pageName: string;
}

export interface CommandResponder<S extends Schema> {
  help: Readonly<HelpInfo>;
  schema: Readonly<S>;
  on(message: CommandMessage<S>): Promise<void>;
}

export const createMockMessage = <S extends Schema>(
  args: Readonly<ParsedSchema<S>>,
  reply?:
    | ((message: EmbedMessage) => void)
    | ((message: EmbedMessage) => Promise<SentMessage> | Promise<void>),
  partial?: Readonly<Partial<Omit<CommandMessage<S>, 'reply'>>>
): CommandMessage<S> => ({
  senderId: '279614913129742338' as Snowflake,
  senderGuildId: '683939861539192860' as Snowflake,
  senderChannelId: '711127633810817026' as Snowflake,
  senderVoiceChannelId: '683939861539192865' as Snowflake,
  senderName: 'Mikuroさいな',
  args,
  reply: reply
    ? async (mes) =>
        ((await reply(mes)) as SentMessage | undefined) ?? {
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
