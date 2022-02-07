import { addDays, isBefore, setHours, setMinutes, setSeconds } from 'date-fns';
import type { EmbedMessage } from '../model/embed-message';
import type { Snowflake } from '../model/id';
import { Reservation, ReservationTime } from '../model/reservation';
import type {
  Clock,
  MessageEvent,
  MessageEventResponder,
  ScheduleRunner
} from '../runner';
import type { CommandMessage } from './command-message';
import type { VoiceConnectionFactory } from './voice-connection';

export type KaereMusicKey = 'NEROYO';

export interface VoiceRoomController {
  disconnectAllUsersIn(guildId: Snowflake, roomId: Snowflake): Promise<void>;
}

export type ReservationResult = 'Ok' | 'Err';

export interface ReservationRepository {
  all(): Promise<readonly Reservation[]>;
  reservationAt(time: ReservationTime): Promise<Reservation | null>;
  reserve(reservation: Reservation): Promise<ReservationResult>;
  cancel(reservation: Reservation): Promise<ReservationResult>;
}

const timeFormatErrorMessage: EmbedMessage = {
  title: '日時の形式が読めないよ。',
  description: '`HH:MM` の形式で指定してくれないかな。'
};

export class KaereCommand implements MessageEventResponder<CommandMessage> {
  constructor(
    private readonly connectionFactory: VoiceConnectionFactory<KaereMusicKey>,
    private readonly controller: VoiceRoomController,
    private readonly clock: Clock,
    private readonly scheduleRunner: ScheduleRunner,
    private readonly repo: ReservationRepository
  ) {
    void repo.all().then((all) => {
      for (const reservation of all) {
        this.scheduleToStart(reservation);
      }
    });
  }

  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }
    const { args } = message;
    if (args.length < 1 || args[0] !== 'kaere') {
      return;
    }
    if (args.length === 1) {
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
    switch (args[1]) {
      case 'bed':
        return this.handleBedCommand(message);
      case 'reserve':
        return this.handleReserveCommand(message);
    }
    await message.reply({
      title: 'Kaereヘルプ',
      description: `
引数無しだと即座にKaereするよ。
- \`bed enable\`/\`bed disable\`: 強制切断モードの有効/無効化
- \`bed status\`: 強制切断モードの状態の確認
- \`reserve add [HH]:[MM]\`: Kaereの開始を指定時刻で予約
- \`reserve cancel [HH]:[MM]\`: 指定時刻の予約をキャンセル
- \`reserve list\`: 予約リストの一覧
`
    });
  }

  private bedModeEnabled = false;
  private doingKaere = false;

  private async start(guildId: Snowflake, roomId: Snowflake): Promise<void> {
    if (this.doingKaere) {
      return;
    }
    this.doingKaere = true;
    const connection = await this.connectionFactory.connectTo(guildId, roomId);
    connection.connect();
    await connection.playToEnd('NEROYO');
    if (this.bedModeEnabled) {
      try {
        await this.controller.disconnectAllUsersIn(guildId, roomId);
      } catch (e) {
        console.error('強制切断に失敗');
      }
    }
    connection.destroy();
    this.doingKaere = false;
  }

  private async handleBedCommand(message: CommandMessage): Promise<void> {
    switch (message.args[2]) {
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
    await message.reply({
      title: 'Kaere強制切断モードヘルプ',
      description: `
- \`bed enable\`/\`bed disable\`: 強制切断モードの有効/無効化
- \`bed status\`: 強制切断モードの状態の確認
`
    });
  }

  private async handleReserveCommand(message: CommandMessage): Promise<void> {
    switch (message.args[2]) {
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
          const time = ReservationTime.fromHoursMinutes(message.args[3]);
          if (!time) {
            await message.reply(timeFormatErrorMessage);
            return;
          }
          const reservation = Reservation.new(
            time,
            message.senderGuildId,
            roomId
          );
          if ((await this.repo.reserve(reservation)) === 'Err') {
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
          const time = ReservationTime.fromHoursMinutes(message.args[3]);
          if (!time) {
            await message.reply(timeFormatErrorMessage);
            return;
          }
          const reservation = await this.repo.reservationAt(time);
          if (!reservation) {
            await message.reply({
              title: '予約キャンセルに失敗したよ。',
              description: `司令官、${time.intoJapanese()}には予約が入ってないよ。`
            });
            return;
          }
          this.scheduleRunner.stop(reservation.id);
          await this.repo.cancel(reservation);
          await message.reply({
            title: '予約キャンセルに成功したよ。',
            description: `${time.intoJapanese()}の予約はキャンセルしておくね。`
          });
        }
        return;
      case 'list':
        {
          const reservations = await this.repo.all();
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
    await message.reply({
      title: 'Kaere予約ヘルプ',
      description: `
- \`reserve add [HH]:[MM]\`: Kaereの開始を指定時刻で予約
- \`reserve cancel [HH]:[MM]\`: 指定時刻の予約をキャンセル
- \`reserve list\`: 予約リストの一覧
`
    });
  }

  private scheduleToStart(reservation: Reservation) {
    const now = this.clock.now();
    let set = setHours(now, reservation.time.hours);
    set = setMinutes(set, reservation.time.minutes);
    set = setSeconds(set, 0);
    if (isBefore(set, now)) {
      set = addDays(set, 1);
    }
    this.scheduleRunner.runOnNextTime(
      reservation.id,
      async () => {
        await this.start(reservation.guildId, reservation.voiceRoomId);
        return null;
      },
      set
    );
  }
}
