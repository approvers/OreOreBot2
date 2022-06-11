import type { Snowflake } from '../model/id.js';

/**
 * ボイスチャンネルへの接続を生成する抽象。`K` は再生したいデータを指すためのキーの型で `"hoge" | "fuga"` などが入る。
 *
 * @export
 * @interface VoiceConnectionFactory
 * @template K
 */
export interface VoiceConnectionFactory<K> {
  /**
   * 特定のボイスチャンネルへ接続できる `VoiceConnection` を作成する。
   *
   * @param {Snowflake} guildId 接続するボイスチャンネルがあるサーバの ID。
   * @param {Snowflake} roomId ボイスチャンネルの ID。
   * @returns {Promise<VoiceConnection<K>>}
   * @memberof VoiceConnectionFactory
   */
  connectTo(guildId: Snowflake, roomId: Snowflake): Promise<VoiceConnection<K>>;
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
   * 接続を開始し、データを再生できるようにする。
   *
   * @memberof VoiceConnection
   */
  connect(): void;
  /**
   * 接続を破棄し、データを再生できないようにする。
   *
   * @memberof VoiceConnection
   */
  destroy(): void;

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
   * 回復できない接続解除が発生した時に、同じチャンネルへ再接続するかどうかのハンドラを登録する。ボイスチャンネルが削除されたなど、必ず再接続できないこともある。
   *
   * @param {() => boolean} shouldReconnect `true` を返す場合は、回復できない接続解除でも同じチャンネルへの再接続を試みる。
   * @memberof VoiceConnection
   */
  onDisconnected(shouldReconnect: () => boolean): void;
}
