import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';
import type { Schema } from '../../model/command-schema.js';
import type { Snowflake } from '../../model/id.js';
import type { VoiceConnectionFactory } from '../voice-connection.js';
import type { VoiceRoomController } from './kaere.js';

export type GyokuonAssetKey = 'GYOKUON';

const SCHEMA = {
  names: ['gyokuon'],
  subCommands: {}
} as const satisfies Schema;

/**
 * gyokuon コマンドでこるくの玉音放送をボイスチャンネルに再生する機能
 *
 * @export
 */
export class GyokuonCommand implements CommandResponder<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'こるくの玉音放送',
    description:
      'VC内にこるくの玉音放送を再生するよ。引数無しで即起動。どの方式でもコマンド発行者がVCに居ないと動かないよ。'
  };
  readonly schema = SCHEMA;

  constructor(
    private readonly deps: {
      connectionFactory: VoiceConnectionFactory<GyokuonAssetKey>;
      controller: VoiceRoomController;
    }
  ) {}

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const roomId = message.senderVoiceChannelId;
    if (!roomId) {
      await message.reply({
        title: 'Gyokuon安全装置が作動したよ。',
        description:
          '起動した本人がボイスチャンネルに居ないのでキャンセルしておいた。悪く思わないでね。'
      });
      return;
    }

    await message.reply({
      title: 'こるく天皇の玉音放送だよ',
      description: '全鯖民に対しての大詔だから椅子から立って聞いてね'
    });
    await this.start(message.senderGuildId, roomId);
    return;
  }

  // 玉音放送がすでに行われているか
  private doingGyokuon = false;
  private async start(guildId: Snowflake, roomId: Snowflake): Promise<void> {
    if (this.doingGyokuon) {
      return;
    }

    this.doingGyokuon = true;
    const connectionVC = await this.deps.connectionFactory.connectTo(
      guildId,
      roomId
    );

    connectionVC.connect();
    connectionVC.onDisconnected(() => {
      this.doingGyokuon = false;
      return false;
    });

    await connectionVC.playToEnd('GYOKUON');

    connectionVC.destroy();
    this.doingGyokuon = false;
  }
}
