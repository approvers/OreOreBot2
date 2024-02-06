import type { DepRegistry } from '../../driver/dep-registry.js';
import type { Schema } from '../../model/command-schema.js';
import type { Snowflake } from '../../model/id.js';
import type { HelpInfo } from '../../runner/command.js';
import { voiceConnectionFactoryKey } from '../voice-connection.js';
import type { CommandMessage, CommandResponderFor } from './command-message.js';

export type GyokuonAssetKey = 'GYOKUON' | 'GYOKUON_SHORT';

const SCHEMA = {
  names: ['gyokuon'],
  description: 'こるくの玉音放送を再生するよ',
  subCommands: {},
  params: [
    {
      type: 'BOOLEAN',
      name: '短縮版',
      description:
        '`true`でこるくの玉音放送の短縮版を流すよ。`false`を指定しない場合・指定しない場合はフル版を再生するよ',
      defaultValue: false
    }
  ]
} as const satisfies Schema;

/**
 * gyokuon コマンドでこるくの玉音放送をボイスチャンネルに再生する機能
 */
export class GyokuonCommand implements CommandResponderFor<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'こるくの玉音放送',
    description:
      'VC内にこるくの玉音放送を再生するよ。引数無しで即起動。どの方式でもコマンド発行者がVCに居ないと動かないよ。',
    // 音声機能関連の機能は voice/ 以下にドキュメントを置いているため
    pageName: 'voice/colk'
  };
  readonly schema = SCHEMA;

  constructor(private readonly reg: DepRegistry) {}

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const [shortFlag] = message.args.params;
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
    await this.start(message.senderGuildId, roomId, shortFlag);
    return;
  }

  // 玉音放送がすでに行われているか
  private doingGyokuon = false;
  private async start(
    guildId: Snowflake,
    roomId: Snowflake,
    isShort: boolean
  ): Promise<void> {
    if (this.doingGyokuon) {
      return;
    }

    this.doingGyokuon = true;
    const connectionFactory = this.reg.get<
      typeof voiceConnectionFactoryKey,
      GyokuonAssetKey
    >(voiceConnectionFactoryKey);
    const connectionVC = await connectionFactory.connectTo(guildId, roomId);

    connectionVC.connect();
    connectionVC.onDisconnected(() => {
      this.doingGyokuon = false;
    });

    if (isShort) {
      await connectionVC.playToEnd('GYOKUON_SHORT');
    } else {
      await connectionVC.playToEnd('GYOKUON');
    }

    connectionVC.destroy();
    this.doingGyokuon = false;
  }
}
