import { addHours, getMinutes, setMinutes, setSeconds } from 'date-fns';

import type { DepRegistry } from '../../driver/dep-registry.js';
import type { Schema } from '../../model/command-schema.js';
import type { EmbedMessage } from '../../model/embed-message.js';
import { randomGeneratorKey } from '../../model/random-generator.js';
import type { HelpInfo } from '../../runner/command.js';
import { clockKey, scheduleRunnerKey } from '../../runner/index.js';
import {
  voiceConnectionFactoryKey,
  type VoiceConnection
} from '../voice-connection.js';
import type { CommandMessage, CommandResponderFor } from './command-message.js';

const partyStarting: EmbedMessage = {
  title: 'パーティー Nigth',
  description: 'хорошо、宴の始まりだ。'
};

const assetKeys = [
  'COFFIN_INTRO',
  'COFFIN_DROP',
  'KAKAPO',
  'KAKUSIN_DAISUKE',
  'POTATO'
] as const;

export type AssetKey = (typeof assetKeys)[number];

const SCHEMA = {
  names: ['party'],
  description: 'VC内の人類に押しかけてPartyを開くよ',
  subCommands: {
    enable: {
      type: 'SUB_COMMAND',
      description: 'ゲリラを有効化するよ'
    },
    disable: {
      type: 'SUB_COMMAND',
      description: 'ゲリラを無効化するよ'
    },
    status: {
      type: 'SUB_COMMAND',
      description: '現在のゲリラの設定を確認するよ'
    },
    time: {
      type: 'SUB_COMMAND',
      description: '次にゲリラを始める時間を設定するよ',
      params: [
        {
          type: 'INTEGER',
          name: 'start_minutes',
          description:
            '分単位で指定できるよ。指定しなかったり負数を指定したらランダムになるよ。',
          defaultValue: -1
        }
      ]
    },
    set: {
      type: 'SUB_COMMAND',
      description: '次の Party で再生する曲を設定するよ',
      params: [
        {
          type: 'CHOICES',
          name: 'music',
          description: '再生する曲の ID だよ。',
          choices: assetKeys
        }
      ]
    },
    start: {
      type: 'SUB_COMMAND',
      description: 'VC内の人類に押しかけてPartyを開くよ。'
    }
  }
} as const satisfies Schema;

/**
 * `party` コマンドで押し掛けPartyする機能。
 */
export class PartyCommand implements CommandResponderFor<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'Party一葉',
    description:
      'VC内の人類に押しかけてPartyを開くよ。どの方式でもコマンド発行者がVCに居ないと動かないよ',
    // 音声機能関連の機能は voice/ 以下にドキュメントを置いているため
    pageName: 'voice/party'
  };
  readonly schema = SCHEMA;

  constructor(private readonly reg: DepRegistry) {}

  private nextMusicKey: AssetKey | null = null;
  private connection: VoiceConnection<AssetKey> | null = null;
  private randomizedEnabled = false;

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const { args } = message;
    if (!args.subCommand || args.subCommand.name === 'start') {
      await this.startPartyImmediately(message);
      return;
    }
    switch (args.subCommand.name) {
      case 'disable':
        this.stopRandomized();
        await message.reply({ title: 'ゲリラを無効化しておいたよ。' });
        return;
      case 'enable':
        this.activateRandomized(message);
        await message.reply({ title: 'ゲリラを有効化しておいたよ。' });
        return;
      case 'status':
        await message.reply({
          title: `ゲリラは現在${this.randomizedEnabled ? '有効' : '無効'}だよ。`
        });
        return;
      case 'time':
        {
          let [minutes] = args.subCommand.params;
          if (0 <= args.subCommand.params[0]) {
            minutes = minutes % 60;
          } else {
            minutes = this.reg.get(randomGeneratorKey).minutes();
          }
          this.startPartyAt(minutes, message);
          await message.reply({
            title: `次のゲリラ参加時刻を${minutes}分にしたよ。`
          });
        }
        return;
      case 'set':
        {
          const musicKey = assetKeys[args.subCommand.params[0]];
          this.nextMusicKey = musicKey;
          await message.reply({ title: 'BGMを設定したよ。' });
        }
        return;
    }
  }

  private generateNextKey(): AssetKey {
    if (this.nextMusicKey) {
      const next = this.nextMusicKey;
      this.nextMusicKey = null;
      return next;
    }
    return this.reg.get(randomGeneratorKey).pick(assetKeys);
  }

  private async startPartyImmediately(
    message: CommandMessage<typeof SCHEMA>
  ): Promise<'BREAK' | 'CONTINUE'> {
    if (this.connection) {
      return 'BREAK';
    }
    const roomId = message.senderVoiceChannelId;
    if (!roomId) {
      await message.reply({
        title: 'Party安全装置が作動したよ。',
        description:
          '起動した本人がボイスチャンネルに居ないのでキャンセルしておいた。悪く思わないでね。'
      });
      return 'BREAK';
    }
    this.connection = await this.reg
      .get<typeof voiceConnectionFactoryKey, AssetKey>(
        voiceConnectionFactoryKey
      )
      .connectTo(message.senderGuildId, roomId);
    this.connection.connect();
    this.connection.onDisconnected(() => {
      this.connection = null;
    });
    await message.reply(partyStarting);
    await this.connection.playToEnd(this.generateNextKey());
    this.connection.destroy();
    this.connection = null;
    return 'CONTINUE';
  }

  private nextTime(minutes: number): Date {
    let nextTime = this.reg.get(clockKey).now();
    if (minutes <= getMinutes(nextTime)) {
      nextTime = addHours(nextTime, 1);
    }
    nextTime = setMinutes(nextTime, minutes);
    return setSeconds(nextTime, 0);
  }

  private startPartyAt(
    minutes: number,
    message: CommandMessage<typeof SCHEMA>
  ) {
    this.reg.get(scheduleRunnerKey).runOnNextTime(
      'party-once',
      async () => {
        await this.startPartyImmediately(message);
        return null;
      },
      this.nextTime(minutes)
    );
  }

  private activateRandomized(message: CommandMessage<typeof SCHEMA>) {
    this.randomizedEnabled = true;
    this.reg.get(scheduleRunnerKey).runOnNextTime(
      'party-random',
      async () => {
        if ((await this.startPartyImmediately(message)) === 'BREAK') {
          this.randomizedEnabled = false;
          return null;
        }
        return this.nextTime(this.reg.get(randomGeneratorKey).minutes());
      },
      this.nextTime(this.reg.get(randomGeneratorKey).minutes())
    );
  }

  private stopRandomized() {
    this.reg.get(scheduleRunnerKey).stop('party-random');
    this.randomizedEnabled = false;
  }
}
