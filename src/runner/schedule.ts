import { differenceInMilliseconds } from 'date-fns';

/**
 * `ScheduleRunner` に登録するイベントが実装するインターフェイス。戻り値は次に自身を再実行するまでのミリ秒数。`null` を返した場合は再実行されない。
 *
 * @export
 * @interface MessageEventResponder
 * @template M
 */
export interface ScheduleTask {
  (): Promise<number | null>;
}

/**
 * 機能を指定ミリ秒後や特定時刻に実行する。特定間隔での再実行については `ScheduleTask` を参照。
 *
 * @export
 * @class MessageResponseRunner
 * @template M
 */
export class ScheduleRunner {
  private runningTasks = new Map<object, ReturnType<typeof setTimeout>>();

  killAll(): void {
    for (const task of this.runningTasks.values()) {
      clearTimeout(task);
    }
    this.runningTasks.clear();
  }

  runAfter(key: object, task: ScheduleTask, milliSeconds: number): void {
    this.startInner(key, task, milliSeconds);
  }

  runOnNextTime(key: object, task: ScheduleTask, time: Date): void {
    this.startInner(key, task, differenceInMilliseconds(new Date(), time));
  }

  stop(key: object): void {
    const id = this.runningTasks.get(key);
    if (id !== undefined) {
      clearTimeout(id);
      this.runningTasks.delete(key);
    }
  }

  private startInner(key: object, task: ScheduleTask, timeout: number): void {
    const id = setTimeout(async () => {
      const newTimeout = await task();
      this.onDidRun(key, task, newTimeout);
    }, timeout);
    this.runningTasks.set(key, id);
  }

  private onDidRun(
    key: object,
    task: ScheduleTask,
    timeout: number | null
  ): void {
    if (timeout === null) {
      this.runningTasks.delete(key);
    } else {
      this.startInner(key, task, timeout);
    }
  }
}
