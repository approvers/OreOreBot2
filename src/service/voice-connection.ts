import { Snowflake } from '../model/id';

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
   * @return {Promise<VoiceConnection<K>>}
   * @memberof VoiceConnectionFactory
   */
  connectSameTo(
    userId: Snowflake,
    guildId: Snowflake
  ): Promise<VoiceConnection<K>>;
}

export interface VoiceConnection<K> {
  playToEnd(key: K): Promise<void>;
  play(key: K): void;
  pause(): void;
  unpause(): void;
  destroy(): void;

  onDisconnected(shouldReconnect: () => boolean): void;
}
