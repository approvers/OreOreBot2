import type { Snowflake } from '../model/id';

/**
 * ボイスチャンネルへの接続を生成する抽象。`K` は再生したいデータを指すためのキーの型で `"hoge" | "fuga"` などが入る。
 *
 * @export
 * @interface VoiceConnectionFactory
 * @template K
 */
export interface VoiceConnectionFactory<K> {
  /**
   * `userId` のユーザが現在接続しているボイスチャンネルへ接続し `VoiceConnection` を作成する。
   *
   * @param {Snowflake} userId 参照するユーザの ID。
   * @param {Snowflake} guildId 参照するユーザが所属するサーバの ID。
   * @returns {Promise<VoiceConnection<K>>}
   * @memberof VoiceConnectionFactory
   */
  connectSameTo(
    userId: Snowflake,
    guildId: Snowflake
  ): Promise<VoiceConnection<K>>;
}

/**
 * ボイスチャンネルへの接続の抽象。`K` は再生したいデータを指すためのキーの型で `"hoge" | "fuga"` などが入る。
 *
 * @export
 * @interface VoiceConnection
 * @template K
 */
export interface VoiceConnection<K> {
  /**
   * `key` のデータを非同期で再生する。
   *
   * @param {K} key
   * @returns {Promise<void>} 再生が終了すると resolve される。
   * @memberof VoiceConnection
   */
  playToEnd(key: K): Promise<void>;
  /**
   * `key` のデータを非同期で再生する。
   *
   * @param {K} key
   * @memberof VoiceConnection
   */
  play(key: K): void;
  /**
   * 現在の再生を一時停止する。
   *
   * @memberof VoiceConnection
   */
  pause(): void;
  /**
   * 現在の再生の一時停止を解除する。
   *
   * @memberof VoiceConnection
   */
  unpause(): void;
  /**
   * 接続を破棄し、データを再生できないようにする。
   *
   * @memberof VoiceConnection
   */
  destroy(): void;

  /**
   * 回復できない接続解除が発生した時に、同じチャンネルへ再接続するかどうかのハンドラを登録する。ボイスチャンネルが削除されたなど、必ず再接続できないこともある。
   *
   * @param {() => boolean} shouldReconnect `true` を返す場合は、回復できない接続解除でも同じチャンネルへの再接続を試みる。
   * @memberof VoiceConnection
   */
  onDisconnected(shouldReconnect: () => boolean): void;
}
