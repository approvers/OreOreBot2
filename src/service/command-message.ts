import type { EmbedMessage } from '../model/embed-message';
import type { Snowflake } from '../model/id';

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
   * コマンドの送信者の所属サーバーの ID。
   *
   * @type {Snowflake}
   * @memberof CommandMessage
   */
  senderGuildId: Snowflake;

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
   * @type {readonly string[]}
   * @memberof CommandMessage
   */
  reply(message: EmbedMessage): Promise<void>;
}
