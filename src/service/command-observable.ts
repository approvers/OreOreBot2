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
  sender: Snowflake;

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
  reply(message: string): Promise<void>;
}
