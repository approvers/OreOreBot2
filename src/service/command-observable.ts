/**
 * コマンド形式のメッセージの抽象。
 *
 * @export
 * @interface CommandMessage
 */
export interface CommandMessage {
  args: readonly string[];
}
