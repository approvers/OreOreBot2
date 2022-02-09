import { addHours, getMinutes, setMinutes, setSeconds } from 'date-fns';
import type { EmbedMessage } from '../model/embed-message';
import type {
  Clock,
  MessageEvent,
  MessageEventResponder,
  ScheduleRunner
} from '../runner';
import type { CommandMessage } from './command-message';
import type {
  VoiceConnection,
  VoiceConnectionFactory
} from './voice-connection';

const partyStarting: EmbedMessage = {
  title: 'パーティー Nigth',
  description: 'хорошо、宴の始まりだ。'
};

const assetKeys = ['COFFIN_INTRO', 'COFFIN_DROP', 'KAKAPO'] as const;

export type AssetKey = typeof assetKeys[number];

export interface RandomGenerator {
  /**
   * 0 以上 59 以下の乱数を生成する。
   *
   * @return {*}  {number}
   * @memberof RandomMinutes
   */
  minutes(): number;

  /**
   * `array` からランダムな一要素を取り出す。
   *
   * @template T
   * @param {readonly} array
   * @param {*} T[]
   * @return {*} {T}
   * @memberof RandomGenerator
   */
  pick<T>(array: readonly T[]): T;
}

/**
 * `party` コマンドで押し掛けPartyする機能。
 *
 * @export
 * @class PartyCommand
 * @implements {MessageEventResponder<CommandMessage>}
 */
export class PartyCommand implements MessageEventResponder<CommandMessage> {
  constructor(
    private readonly factory: VoiceConnectionFactory<AssetKey>,
    private readonly clock: Clock,
    private readonly scheduleRunner: ScheduleRunner,
    private readonly random: RandomGenerator
  ) {}

  private nextMusicKey: AssetKey | null = null;
  private connection: VoiceConnection<AssetKey> | null = null;
  private randomizedEnabled = false;

  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }
    const { args } = message;
    if (args.length < 1 || args[0] !== 'party') {
      return;
    }
    if (args.length === 1) {
      await this.startPartyImmediately(message);
      return;
    }
    switch (args[1]) {
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
          let minutes: number;
          if (args.length === 3) {
            minutes = parseInt(args[2], 10) % 60;
          } else {
            minutes = this.random.minutes();
          }
          this.startPartyAt(minutes, message);
          await message.reply({
            title: `次のゲリラ参加時刻を${minutes}分にしたよ。`
          });
        }
        return;
      case 'set':
        {
          const musicKey = args[2];
          if (!(assetKeys as readonly string[]).includes(musicKey)) {
            await message.reply({
              title: 'BGMを設定できなかった。',
              description: `以下のいずれかを指定してね。\n${assetKeys
                .map((key) => `- ${key}`)
                .join('\n')}`
            });
            return;
          }
          this.nextMusicKey = musicKey as AssetKey;
          await message.reply({ title: 'BGMを設定したよ。' });
        }
        return;
    }
    await message.reply({
      title: 'Party一葉ヘルプ',
      description: `
引数無しだと即座にPartyするよ。
- \`enable\`/\`disable\`: ゲリラモードの有効/無効化
- \`status\`: ゲリラモードの状態の確認
- \`time\`: ゲリラモードの参加時刻を上書き指定
- \`set\`: 次のPartyの曲を上書き指定
`
    });
  }

  private generateNextKey(): AssetKey {
    if (this.nextMusicKey) {
      const next = this.nextMusicKey;
      this.nextMusicKey = null;
      return next;
    }
    return this.random.pick(assetKeys);
  }

  private async startPartyImmediately(message: CommandMessage): Promise<void> {
    if (this.connection) {
      return;
    }
    const roomId = message.senderVoiceChannelId;
    if (!roomId) {
      await message.reply({
        title: 'Party安全装置が作動したよ。',
        description:
          '起動した本人がボイスチャンネルに居ないのでキャンセルしておいた。悪く思わないでね。'
      });
      return;
    }
    this.connection = await this.factory.connectTo(
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
  }

  private nextTime(minutes: number): Date {
    let nextTime = this.clock.now();
    if (minutes <= getMinutes(nextTime)) {
      nextTime = addHours(nextTime, 1);
    }
    nextTime = setMinutes(nextTime, minutes);
    return setSeconds(nextTime, 0);
  }

  private startPartyAt(minutes: number, message: CommandMessage) {
    this.scheduleRunner.runOnNextTime(
      { key: 'party-once' },
      async () => {
        await this.startPartyImmediately(message);
        return null;
      },
      this.nextTime(minutes)
    );
  }

  private activateRandomized(message: CommandMessage) {
    this.randomizedEnabled = true;
    this.scheduleRunner.runOnNextTime(
      'party-random',
      async () => {
        await this.startPartyImmediately(message);
        return this.nextTime(this.random.minutes());
      },
      this.nextTime(this.random.minutes())
    );
  }

  private stopRandomized() {
    this.scheduleRunner.stop('party-random');
    this.randomizedEnabled = false;
  }
}
