import { addMilliseconds, differenceInMilliseconds } from 'date-fns';

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

/**
 * 機能を指定ミリ秒後や特定時刻に実行する。特定間隔での再実行については `ScheduleTask` を参照。
 *
 * @export
 * @class MessageResponseRunner
 * @template M
 */
export class ScheduleRunner {
  constructor(private readonly clock: Clock) {}

  private runningTasks = new Map<unknown, ReturnType<typeof setTimeout>>();

  killAll(): void {
    for (const task of this.runningTasks.values()) {
      clearTimeout(task);
    }
    this.runningTasks.clear();
  }

  runAfter(key: unknown, task: ScheduleTask, milliSeconds: number): void {
    this.startInner(key, task, addMilliseconds(this.clock.now(), milliSeconds));
  }

  runOnNextTime(key: unknown, task: ScheduleTask, time: Date): void {
    this.startInner(key, task, time);
  }

  stop(key: unknown): void {
    const id = this.runningTasks.get(key);
    if (id !== undefined) {
      clearTimeout(id);
      this.runningTasks.delete(key);
    }
  }

  private startInner(key: unknown, task: ScheduleTask, timeout: Date): void {
    const old = this.runningTasks.get(key);
    if (old) {
      clearTimeout(old);
    }
    const id = setTimeout(() => {
      void (async () => {
        const newTimeout = await task().catch((e) => {
          console.error(e);
          return null;
        });
        this.onDidRun(key, task, newTimeout);
      })();
    }, differenceInMilliseconds(timeout, this.clock.now()));
    this.runningTasks.set(key, id);
  }

  private onDidRun(
    key: unknown,
    task: ScheduleTask,
    timeout: Date | null
  ): void {
    if (timeout === null) {
      this.runningTasks.delete(key);
    } else {
      this.startInner(key, task, timeout);
    }
  }
}
