import { differenceInMilliseconds } from 'date-fns';

export interface ScheduleTask {
  (): Promise<number | null>;
}

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
