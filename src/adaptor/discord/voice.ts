import {
  type AudioPlayer,
  AudioPlayerStatus,
  type VoiceConnection as RawVoiceConnection,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel
} from '@discordjs/voice';
import {
  ChannelType,
  type Client,
  PermissionsBitField,
  type VoiceBasedChannel
} from 'discord.js';

import type { Snowflake } from '../../model/id.js';
import type { VoiceRoomController } from '../../service/command/kaere.js';
import type {
  VoiceConnection,
  VoiceConnectionFactory
} from '../../service/voice-connection.js';

/**
 * ボイスチャンネルへの接続が、復帰できない切断 (管理者の手で切断させられたなど) になったと判断するまでのミリ秒数。
 */
const TIMEOUT_MS = 2500;

export class DiscordVoiceConnectionFactory<K extends string | number | symbol>
  implements VoiceConnectionFactory<K>
{
  constructor(
    private readonly client: Client,
    private readonly audioRecord: Record<K, string>
  ) {}

  async connectTo(
    guildId: Snowflake,
    roomId: Snowflake
  ): Promise<VoiceConnection<K>> {
    const guild = await this.client.guilds.fetch(guildId);
    if (!guild.available) {
      throw new Error('guild unavailable');
    }
    const channel =
      guild.channels.cache.get(roomId) || (await guild.channels.fetch(roomId));
    if (!channel) {
      throw new Error('the user is not joined to voice channel');
    }
    if (channel.type !== ChannelType.GuildVoice) {
      throw new TypeError('the id is not an id for voice channel');
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
   * @param channel - 接続するボイスチャンネル
   * @param audioRecord - 再生データのキーとファイルパスの辞書
   */
  constructor(
    private readonly channel: VoiceBasedChannel,
    private readonly audioRecord: Record<K, string>
  ) {
    this.player = createAudioPlayer();
  }

  private connection: RawVoiceConnection | null = null;
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
    this.playToEnd(key).catch(console.error);
  }
  private reserveToPlay() {
    const subscription = this.connection?.subscribe(this.player);
    if (subscription) {
      setTimeout(() => {
        if (this.player.state.status === 'playing') {
          return;
        }
        subscription.unsubscribe();
      }, TIMEOUT_MS);
    }
  }
  pause(): void {
    this.player.pause();
  }
  unpause(): void {
    this.player.unpause();
  }

  connect(): void {
    this.connection = joinVoiceChannel({
      channelId: this.channel.id,
      guildId: this.channel.guildId,
      adapterCreator: this.channel.guild.voiceAdapterCreator
    });
  }
  destroy(): void {
    this.player.stop();
    this.connection?.destroy();
    this.connection = null;
  }

  onDisconnected(shouldReconnect: () => boolean): void {
    if (!this.connection) {
      throw new Error(
        'You must invoke `connect` before to register disconnection handler'
      );
    }
    this.connection.on(
      VoiceConnectionStatus.Disconnected,
      () => void this.makeDisconnectionHandler(shouldReconnect)
    );
  }
  private makeDisconnectionHandler(shouldReconnect: () => boolean) {
    return async () => {
      if (!this.connection) {
        return;
      }
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
      if (!shouldReconnect()) {
        return;
      }
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
    };
  }
}

export class DiscordVoiceRoomController implements VoiceRoomController {
  constructor(private readonly client: Client) {}

  async disconnectAllUsersIn(
    guildId: Snowflake,
    roomId: Snowflake
  ): Promise<void> {
    const guild =
      this.client.guilds.cache.get(guildId) ||
      (await this.client.guilds.fetch(guildId));
    if (
      !guild.members.me?.permissions.has(PermissionsBitField.Flags.MoveMembers)
    ) {
      throw new Error('insufficient permission');
    }
    const room =
      guild.channels.cache.get(roomId) || (await guild.channels.fetch(roomId));
    if (room?.type !== ChannelType.GuildVoice) {
      throw new TypeError(`invalid room id: ${roomId}`);
    }
    await Promise.all(
      room.members.map((member) =>
        member.voice.disconnect('†***R.I.P.***† ***安らかに眠れ***')
      )
    );
  }
}
