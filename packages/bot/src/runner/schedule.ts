import { addMilliseconds, isAfter } from 'date-fns';

import type { Dep0, DepRegistry } from '../driver/dep-registry.js';

/**
 * `ScheduleRunner` に登録するイベントが実装するインターフェイス。戻り値は次に自身を再実行する UTC 時刻。`null` を返した場合は再実行されない。
 */
export type ScheduleTask = () => Promise<Date | null>;

/**
 * 時刻を扱う抽象。
 */
export interface Clock {
  /**
   * 現在の UTC 時刻を取得する。
   *
   * @returns 呼び出した時点での時刻。
   */
  now(): Date;
}
export type ClockDep = Dep0 & { type: Clock };
export const clockKey = Symbol('CLOCK') as ClockDep;

const CONSUMPTION_INTERVAL = 100;

/**
 * 機能を指定ミリ秒後や特定時刻に実行する。特定間隔での再実行については `ScheduleTask` を参照。
 */
export class ScheduleRunner {
  constructor(private readonly reg: DepRegistry) {
    this.taskConsumerId = setInterval(() => {
      this.consume();
    }, CONSUMPTION_INTERVAL);
  }

  private taskConsumerId: NodeJS.Timeout;
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
   * @param key - あとで登録したタスクを停止させるときに用いるキーのオブジェクト
   * @param task - 実行したいタスク
   * @param milliSeconds - 現在から何ミリ秒経過した時に実行するのか
   */
  runAfter(key: unknown, task: ScheduleTask, milliSeconds: number): void {
    this.queue.set(key, [
      task,
      addMilliseconds(this.reg.get(clockKey).now(), milliSeconds)
    ]);
  }

  /**
   * 特定時刻にタスクを実行するように登録する。
   *
   * @param key - あとで登録したタスクを停止させるときに用いるキーのオブジェクト
   * @param task - 実行したいタスク
   * @param time - いつ実行するのか、UTC 時刻で
   */
  runOnNextTime(key: unknown, task: ScheduleTask, time: Date): void {
    this.queue.set(key, [task, time]);
  }

  /**
   * タスクの実行登録を解除する。このキーに登録されていない場合は何も起こらない。
   *
   * @param key - 実行を登録したときのキーのオブジェクト
   */
  stop(key: unknown): void {
    this.queue.delete(key);
  }

  private extractTaskNeededExe(): [unknown, ScheduleTask][] {
    const now = this.reg.get(clockKey).now();
    return [...this.queue.entries()]
      .filter(([, [, start]]) => isAfter(now, start))
      .map(([key, [task]]) => [key, task]);
  }
}
export type ScheduleRunnerDep = Dep0 & { type: ScheduleRunner };
export const scheduleRunnerKey = Symbol('SCHEDULE_RUNNER') as ScheduleRunnerDep;
