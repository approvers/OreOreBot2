import type { Snowflake } from '../model/id.js';

/**
 * ボイスチャンネルへの接続を生成する抽象。
 *
 * @typeParam K - 再生したいデータを指すためのキーの型
 */
export interface VoiceConnectionFactory<K> {
  /**
   * 特定のボイスチャンネルへ接続できる `VoiceConnection` を作成する。
   *
   * @param guildId - 接続するボイスチャンネルがあるサーバの ID。
   * @param roomId - ボイスチャンネルの ID。
   * @returns ボイスチャンネルへの接続を表すオブジェクトで解決される `Promise`
   */
  connectTo(guildId: Snowflake, roomId: Snowflake): Promise<VoiceConnection<K>>;
}

/**
 * ボイスチャンネルへの接続の抽象。
 *
 * @typeParam K - 再生したいデータを指すためのキーの型
 */
export interface VoiceConnection<K> {
  /**
   * 接続を開始し、データを再生できるようにする。
   */
  connect(): void;
  /**
   * 接続を破棄し、データを再生できないようにする。
   */
  destroy(): void;

  /**
   * `key` のデータを非同期で最後まで再生する。
   *
   * @param key - 再生したいデータのキー
   * @returns 再生が終了すると解決される `Promise`
   */
  playToEnd(key: K): Promise<void>;
  /**
   * `key` のデータを非同期で再生する。
   *
   * @param key - 再生したいデータのキー
   */
  play(key: K): void;
  /**
   * 現在の再生を一時停止する。
   */
  pause(): void;
  /**
   * 現在の再生の一時停止を解除する。
   */
  unpause(): void;

  /**
   * 回復できない接続解除が発生した時に、同じチャンネルへ再接続するかどうかのハンドラを登録する。ボイスチャンネルが削除されたなど、必ず再接続できないこともある。
   *
   * @param shouldReconnect - この関数が `true` を返す場合は、回復できない接続解除でも同じチャンネルへの再接続を試みる。
   */
  onDisconnected(shouldReconnect: () => boolean): void;
}
