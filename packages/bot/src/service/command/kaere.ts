import { addDays, isBefore, setHours, setMinutes, setSeconds } from 'date-fns';

import type { Dep0, DepRegistry } from '../../driver/dep-registry.js';
import type { Schema } from '../../model/command-schema.js';
import type { EmbedMessage } from '../../model/embed-message.js';
import type { Snowflake } from '../../model/id.js';
import { Reservation, ReservationTime } from '../../model/reservation.js';
import { voiceRoomControllerKey } from '../../model/voice-room-controller.js';
import type { HelpInfo } from '../../runner/command.js';
import { scheduleRunnerKey, clockKey } from '../../runner/index.js';
import { standardOutputKey } from '../output.js';
import { voiceConnectionFactoryKey } from '../voice-connection.js';
import type { CommandMessage, CommandResponderFor } from './command-message.js';

export type KaereMusicKey = 'NEROYO';

/**
 * 予約処理の成否を表す型。boolean だとどちらが成功か失敗か分かりづらいので導入した。
 */
export type ReservationResult = 'Ok' | 'Err';

/**
 * 予約 `Reservation` のモデルを永続化するクラスの抽象。
 */
export interface ReservationRepository {
  /**
   * すべての予約を取得する。
   *
   * @returns すべての予約のリストで解決される `Promise`
   */
  all(): Promise<readonly Reservation[]>;
  /**
   * 指定時刻の予約を取得する。
   *
   * @param time - 取得する予約の時刻
   * @returns 指定時刻である予約、存在しない場合は `null` で解決される `Promise`
   */
  reservationAt(time: ReservationTime): Promise<Reservation | null>;
  /**
   * 新しい予約を保存して永続化する。
   *
   * @param reservation - 永続化する予約
   * @returns 保存に成功したかどうかで解決される `Promise`
   */
  reserve(reservation: Reservation): Promise<ReservationResult>;
  /**
   * 予約を取り消して永続化を解除する。
   *
   * @param reservation - 永続化を解除する予約
   * @returns 解除に成功したかどうかで解決される。
   */
  cancel(reservation: Reservation): Promise<ReservationResult>;
}
export interface ReservationRepositoryDep extends Dep0 {
  type: ReservationRepository;
}
export const reservationRepositoryKey = Symbol(
  'RESERVATION_REPOSITORY'
) as unknown as ReservationRepositoryDep;

const timeFormatErrorMessage: EmbedMessage = {
  title: '時刻の形式として読めないよ。',
  description: '`HH:MM` の形式で指定してくれないかな。'
};

const TIME_OPTIONS = [
  {
    type: 'STRING',
    name: '時刻',
    description: '[HH]:[MM] 形式の時刻'
  }
] as const;

const SCHEMA = {
  names: ['kaere'],
  description: 'VC内の人類に就寝を促すよ',
  subCommands: {
    bed: {
      type: 'SUB_COMMAND_GROUP',
      description: '強制切断モードを取り扱うよ',
      subCommands: {
        enable: {
          type: 'SUB_COMMAND',
          description: '強制切断モードを有効化するよ'
        },
        disable: {
          type: 'SUB_COMMAND',
          description: '強制切断モードを無効化するよ'
        },
        status: {
          type: 'SUB_COMMAND',
          description: '現在の強制切断モードの設定を確認するよ'
        }
      }
    },
    reserve: {
      type: 'SUB_COMMAND_GROUP',
      description: '予約システムを取り扱うよ',
      subCommands: {
        add: {
          type: 'SUB_COMMAND',
          description: '指定の時刻で予約するよ',
          params: TIME_OPTIONS
        },
        cancel: {
          type: 'SUB_COMMAND',
          description: '指定時刻の予約をキャンセルするよ',
          params: TIME_OPTIONS
        },
        list: {
          type: 'SUB_COMMAND',
          description: '現在の予約を一覧するよ'
        }
      }
    },
    start: {
      type: 'SUB_COMMAND',
      description: 'VC内の人類に就寝を促すよ。'
    },
    help: {
      type: 'SUB_COMMAND',
      description: '専用のヘルプを表示するよ。'
    }
  }
} as const satisfies Schema;

/**
 * `kaere` コマンドでボイスチャンネルの参加者に切断を促す機能。
 */
export class KaereCommand implements CommandResponderFor<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'Kaere一葉',
    description:
      'VC内の人類に就寝を促すよ。どの方式でもコマンド発行者がVCに居ないと動かないよ',
    // 音声機能関連の機能は voice/ 以下にドキュメントを置いているため
    pageName: 'voice/kaere'
  };
  readonly schema = SCHEMA;

  constructor(private readonly reg: DepRegistry) {
    void reg
      .get(reservationRepositoryKey)
      .all()
      .then((all) => {
        for (const reservation of all) {
          this.scheduleToStart(reservation);
        }
      });
  }

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const { args } = message;
    if (!args.subCommand || args.subCommand.name == 'start') {
      const roomId = message.senderVoiceChannelId;
      if (!roomId) {
        await message.reply({
          title: 'Kaere安全装置が作動したよ。',
          description:
            '起動した本人がボイスチャンネルに居ないのでキャンセルしておいた。悪く思わないでね。'
        });
        return;
      }

      await this.start(message.senderGuildId, roomId);
      return;
    }
    switch (args.subCommand.name) {
      case 'bed':
        return this.handleBedCommand(message);
      case 'reserve':
        return this.handleReserveCommand(message);
      case 'help':
        await message.reply({
          title: 'Kaere強制切断モードヘルプ',
          description: `
- \`bed enable\`/\`bed disable\`: 強制切断モードの有効/無効化
- \`bed status\`: 強制切断モードの状態の確認
`
        });
        return;
    }
  }

  private bedModeEnabled = false;
  private doingKaere = false;

  private async start(guildId: Snowflake, roomId: Snowflake): Promise<void> {
    if (this.doingKaere) {
      return;
    }
    this.doingKaere = true;
    const connectionFactory = this.reg.get<
      typeof voiceConnectionFactoryKey,
      KaereMusicKey
    >(voiceConnectionFactoryKey);
    const connection = await connectionFactory.connectTo(guildId, roomId);
    connection.connect();
    connection.onDisconnected(() => {
      this.doingKaere = false;
    });
    await this.reg.get(standardOutputKey).sendEmbed({
      title: '提督、もうこんな時間だよ',
      description: '早く寝よう'
    });
    await connection.playToEnd('NEROYO');
    if (this.bedModeEnabled) {
      try {
        await this.reg
          .get(voiceRoomControllerKey)
          .disconnectAllUsersIn(guildId, roomId);
      } catch {
        console.error('強制切断に失敗');
      }
    }
    connection.destroy();
    this.doingKaere = false;
  }

  private async handleBedCommand(
    message: CommandMessage<typeof SCHEMA>
  ): Promise<void> {
    if (
      message.args.subCommand == null ||
      message.args.subCommand.name !== 'bed'
    ) {
      throw new Error('expected bed command group');
    }
    switch (message.args.subCommand.subCommand.name) {
      case 'enable':
        this.bedModeEnabled = true;
        await message.reply({
          title: '強制切断モードを有効化したよ。'
        });
        return;
      case 'disable':
        this.bedModeEnabled = false;
        await message.reply({
          title: '強制切断モードを無効化したよ。'
        });
        return;
      case 'status':
        await message.reply({
          title: `強制切断モードは現在${
            this.bedModeEnabled ? '有効' : '無効'
          }だよ。`
        });
        return;
    }
  }

  private async handleReserveCommand(
    message: CommandMessage<typeof SCHEMA>
  ): Promise<void> {
    if (
      message.args.subCommand == null ||
      message.args.subCommand.name !== 'reserve'
    ) {
      throw new Error('expected reserve command group');
    }

    const repo = this.reg.get(reservationRepositoryKey);
    switch (message.args.subCommand.subCommand.name) {
      case 'add':
        {
          const roomId = message.senderVoiceChannelId;
          if (!roomId) {
            await message.reply({
              title: '予約に失敗したよ。',
              description: `参加させたいボイスチャンネル入ってから、このコマンドを使ってくれ。`
            });
            return;
          }
          const time = ReservationTime.fromHoursMinutes(
            message.args.subCommand.subCommand.params[0]
          );
          if (!time) {
            await message.reply(timeFormatErrorMessage);
            return;
          }
          const reservation = Reservation.new(
            time,
            message.senderGuildId,
            roomId
          );
          if ((await repo.reserve(reservation)) === 'Err') {
            await message.reply({
              title: '予約に失敗したよ。',
              description: `あれ、${time.intoJapanese()}にはもう予約が入ってるよ。`
            });
            return;
          }
          this.scheduleToStart(reservation);
          await message.reply({
            title: '予約に成功したよ。',
            description: `${time.intoJapanese()}に予約を入れておくね。`
          });
        }
        return;
      case 'cancel':
        {
          const time = ReservationTime.fromHoursMinutes(
            message.args.subCommand.subCommand.params[0]
          );
          if (!time) {
            await message.reply(timeFormatErrorMessage);
            return;
          }
          const reservation = await repo.reservationAt(time);
          if (!reservation) {
            await message.reply({
              title: '予約キャンセルに失敗したよ。',
              description: `司令官、${time.intoJapanese()}には予約が入ってないよ。`
            });
            return;
          }
          this.reg.get(scheduleRunnerKey).stop(reservation.id);
          if ((await repo.cancel(reservation)) === 'Err') {
            await message.reply({
              title: '予約キャンセルに失敗したよ。',
              description: 'データベースに問題があったのかもしれない。'
            });
            return;
          }
          await message.reply({
            title: '予約キャンセルに成功したよ。',
            description: `${time.intoJapanese()}の予約はキャンセルしておくね。`
          });
        }
        return;
      case 'list':
        {
          const reservations = await repo.all();
          if (reservations.length === 0) {
            await message.reply({
              title: '今は誰も予約してないようだね。'
            });
            return;
          }
          await message.reply({
            title: '現在の予約状況をお知らせするね。',
            description: reservations
              .map((reservation) => `- ${reservation.time.intoJapanese()}`)
              .join('\n')
          });
        }
        return;
    }
  }

  private scheduleToStart(reservation: Reservation) {
    const now = this.reg.get(clockKey).now();
    let set = setHours(now, reservation.time.hours);
    set = setMinutes(set, reservation.time.minutes);
    set = setSeconds(set, 0);
    if (isBefore(set, now)) {
      set = addDays(set, 1);
    }
    this.reg.get(scheduleRunnerKey).runOnNextTime(
      reservation.id,
      async () => {
        await this.reg.get(reservationRepositoryKey).cancel(reservation);
        await this.start(reservation.guildId, reservation.voiceRoomId);
        return null;
      },
      set
    );
  }
}
