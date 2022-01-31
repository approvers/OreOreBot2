import {
  AudioPlayer,
  AudioPlayerStatus,
  VoiceConnection as RawVoiceConnection,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel
} from '@discordjs/voice';
import type { Client, VoiceBasedChannel } from 'discord.js';
import type { Snowflake } from '../model/id';
import type {
  VoiceConnection,
  VoiceConnectionFactory
} from '../service/voice-connection';

const TIMEOUT_MS = 5000;

export class DiscordVoiceConnectionFactory<K extends string | number | symbol>
  implements VoiceConnectionFactory<K>
{
  constructor(
    private readonly client: Client,
    private readonly audioRecord: Record<K, string>
  ) {}

  async connectSameTo(
    userId: Snowflake,
    guildId: Snowflake
  ): Promise<VoiceConnection<K>> {
    const guild =
      this.client.guilds.cache.get(guildId) ||
      (await this.client.guilds.fetch(guildId));
    const member =
      guild.members.cache.get(userId) || (await guild.members.fetch(userId));
    const channel = member.voice.channel;
    if (!channel) {
      throw new Error('the user is not joined to voice channel');
    }
    return new DiscordVoiceConnection(channel, this.audioRecord);
  }
}

export class DiscordVoiceConnection<K extends string | number | symbol>
  implements VoiceConnection<K>
{
  /**
   * Discord のボイスチャンネルへの接続を作成する。
   *
   * @param {VoiceBasedChannel} channel 接続するボイスチャンネル
   * @param {Record<K, string>} audioRecord 再生データのキーとファイルパスの辞書
   * @memberof DiscordVoiceConnection
   */
  constructor(
    private readonly channel: VoiceBasedChannel,
    private readonly audioRecord: Record<K, string>
  ) {
    this.connection = joinVoiceChannel({
      channelId: this.channel.id,
      guildId: this.channel.guildId,
      adapterCreator: this.channel.guild.voiceAdapterCreator
    });
    this.player = createAudioPlayer();
  }

  private connection: RawVoiceConnection;
  private player: AudioPlayer;

  playToEnd(key: K): Promise<void> {
    return new Promise((resolve, reject) => {
      const resource = createAudioResource(this.audioRecord[key]);

      this.player.once('error', reject);
      this.player.once(AudioPlayerStatus.Idle, () => resolve());

      this.player.play(resource);
      this.reserveToPlay();
    });
  }
  play(key: K): void {
    const resource = createAudioResource(this.audioRecord[key]);

    this.player.once('error', (error) => {
      console.error(
        `Error> ${error.message} with resource:`,
        error.resource.metadata
      );
    });

    this.player.play(resource);
    this.reserveToPlay();
  }
  private reserveToPlay() {
    const subscription = this.connection.subscribe(this.player);
    if (subscription) {
      setTimeout(() => subscription.unsubscribe(), TIMEOUT_MS);
    }
  }
  pause(): void {
    this.player.pause();
  }
  unpause(): void {
    this.player.unpause();
  }
  destroy(): void {
    this.player.stop();
    this.connection.destroy();
  }

  onDisconnected(shouldReconnect: () => boolean): void {
    this.connection.on(
      VoiceConnectionStatus.Disconnected,
      this.makeDisconnectionHandler(shouldReconnect)
    );
  }
  private makeDisconnectionHandler(shouldReconnect: () => boolean) {
    return async () => {
      try {
        await Promise.race([
          entersState(
            this.connection,
            VoiceConnectionStatus.Signalling,
            TIMEOUT_MS
          ),
          entersState(
            this.connection,
            VoiceConnectionStatus.Connecting,
            TIMEOUT_MS
          )
        ]);
        // 再接続に成功。
        return;
      } catch (error) {
        console.error(error);
        this.destroy();
      }
      if (shouldReconnect()) {
        try {
          const newConn = new DiscordVoiceConnection(
            this.channel,
            this.audioRecord
          );
          this.connection = newConn.connection;
          this.player = newConn.player;
        } catch (error) {
          console.error(error);
        }
      }
    };
  }
}
