import { addMilliseconds, isAfter } from 'date-fns';

/**
 * `ScheduleRunner` に登録するイベントが実装するインターフェイス。戻り値は次に自身を再実行する時刻。`null` を返した場合は再実行されない。
 *
 * @export
 * @interface MessageEventResponder
 * @template M
 */
export interface ScheduleTask {
  (): Promise<Date | null>;
}

/**
 * 時刻を扱う抽象。
 *
 * @export
 * @interface Clock
 */
export interface Clock {
  /**
   * 現在時刻を取得する。
   *
   * @returns {Date}
   * @memberof Clock
   */
  now(): Date;
}

const CONSUMPTION_INTERVAL = 100;

/**
 * 機能を指定ミリ秒後や特定時刻に実行する。特定間隔での再実行については `ScheduleTask` を参照。
 *
 * @export
 * @class MessageResponseRunner
 * @template M
 */
export class ScheduleRunner {
  constructor(private readonly clock: Clock) {
    this.taskConsumerId = setInterval(() => {
      this.consume();
    }, CONSUMPTION_INTERVAL);
  }

  private taskConsumerId: NodeJS.Timer;
  private queue = new Map<unknown, [ScheduleTask, Date]>();

  /**
   * 登録したタスクのうち指定時刻になったものを実行する。時計の時刻を急に進めた場合などに用いる。
   */
  consume() {
    const neededExe = this.extractTaskNeededExe();
    for (const [key, task] of neededExe) {
      void task()
        .catch((e) => {
          console.error(e);
          return null;
        })
        .then((nextTime) => nextTime && this.queue.set(key, [task, nextTime]));
      this.queue.delete(key);
    }
  }

  /**
   * すべての実行を停止する。テスト終了時などに用いる。
   */
  killAll(): void {
    clearInterval(this.taskConsumerId);
    this.queue.clear();
  }

  /**
   * 現在からミリ秒指定で一定時間後にタスクを実行するように登録する。
   *
   * @param key あとで登録したタスクを停止させるときに用いるキーのオブジェクト
   * @param task 実行したいタスク
   * @param milliSeconds 現在から何ミリ秒経過した時に実行するのか
   */
  runAfter(key: unknown, task: ScheduleTask, milliSeconds: number): void {
    this.queue.set(key, [
      task,
      addMilliseconds(this.clock.now(), milliSeconds)
    ]);
  }

  /**
   * 特定時刻にタスクを実行するように登録する。
   *
   * @param key あとで登録したタスクを停止させるときに用いるキーのオブジェクト
   * @param task 実行したいタスク
   * @param time いつ実行するのか
   */
  runOnNextTime(key: unknown, task: ScheduleTask, time: Date): void {
    this.queue.set(key, [task, time]);
  }

  /**
   * タスクの実行登録を解除する。このキーに登録されていない場合は何も起こらない。
   *
   * @param key 実行を登録したときのキーのオブジェクト
   */
  stop(key: unknown): void {
    this.queue.delete(key);
  }

  private extractTaskNeededExe(): [unknown, ScheduleTask][] {
    const now = this.clock.now();
    return [...this.queue.entries()]
      .filter(([, [, start]]) => isAfter(now, start))
      .map(([key, [task]]) => [key, task]);
  }
}
