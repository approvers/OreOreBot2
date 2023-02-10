import { addHours, getMinutes, setMinutes, setSeconds } from 'date-fns';

import type { EmbedMessage } from '../../model/embed-message.js';
import type { Clock, ScheduleRunner } from '../../runner/index.js';
import type {
  VoiceConnection,
  VoiceConnectionFactory
} from '../voice-connection.js';
import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';

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

export interface RandomGenerator {
  /**
   * 0 以上 59 以下の乱数を生成する。
   *
   * @returns 生成した乱数
   */
  minutes(): number;

  /**
   * `array` からランダムな一要素を取り出す。
   *
   * @typeParam T - リストの型
   * @param array - 取り出す対象のリスト
   * @returns `array` から取り出した 1 つの要素
   *
   * @remarks
   *
   * `array` の長さは `1` 以上でなければならない。さもなくば `T` 型の値が返ることは保証されない。
   */
  pick<T>(array: readonly T[]): T;
}

const SCHEMA = {
  names: ['party'],
  subCommands: {
    enable: {
      type: 'SUB_COMMAND'
    },
    disable: {
      type: 'SUB_COMMAND'
    },
    status: {
      type: 'SUB_COMMAND'
    },
    time: {
      type: 'SUB_COMMAND',
      params: [
        {
          type: 'INTEGER',
          name: '開始する分',
          description:
            '次にゲリラを始める分を指定できるよ。指定しなかったり負数を指定したらランダムになるよ。',
          defaultValue: -1
        }
      ]
    },
    set: {
      type: 'SUB_COMMAND',
      params: [
        {
          type: 'CHOICES',
          name: '曲',
          description: '次の Party で再生する曲を指定できるよ。',
          choices: assetKeys
        }
      ]
    }
  }
} as const;

/**
 * `party` コマンドで押し掛けPartyする機能。
 */
export class PartyCommand implements CommandResponder<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'Party一葉',
    description:
      'VC内の人類に押しかけてPartyを開くよ。引数なしで即起動。どの方式でもコマンド発行者がVCに居ないと動かないよ'
  };
  readonly schema = SCHEMA;

  constructor(
    private readonly deps: {
      factory: VoiceConnectionFactory<AssetKey>;
      clock: Clock;
      scheduleRunner: ScheduleRunner;
      random: RandomGenerator;
    }
  ) {}

  private nextMusicKey: AssetKey | null = null;
  private connection: VoiceConnection<AssetKey> | null = null;
  private randomizedEnabled = false;

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const { args } = message;
    if (!args.subCommand) {
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
            minutes = this.deps.random.minutes();
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
    return this.deps.random.pick(assetKeys);
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
    this.connection = await this.deps.factory.connectTo(
      message.senderGuildId,
      roomId
    );
    this.connection.connect();
    this.connection.onDisconnected(() => {
      this.connection = null;
      return false;
    });
    await message.reply(partyStarting);
    await this.connection.playToEnd(this.generateNextKey());
    this.connection.destroy();
    this.connection = null;
    return 'CONTINUE';
  }

  private nextTime(minutes: number): Date {
    let nextTime = this.deps.clock.now();
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
    this.deps.scheduleRunner.runOnNextTime(
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
    this.deps.scheduleRunner.runOnNextTime(
      'party-random',
      async () => {
        if ((await this.startPartyImmediately(message)) === 'BREAK') {
          this.randomizedEnabled = false;
          return null;
        }
        return this.nextTime(this.deps.random.minutes());
      },
      this.nextTime(this.deps.random.minutes())
    );
  }

  private stopRandomized() {
    this.deps.scheduleRunner.stop('party-random');
    this.randomizedEnabled = false;
  }
}
