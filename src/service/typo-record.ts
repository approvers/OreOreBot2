import { addDays, setHours, setMinutes } from 'date-fns';
import type { Snowflake } from '../model/id';
import type {
  Clock,
  MessageEvent,
  MessageEventResponder,
  ScheduleRunner,
  ScheduleTask
} from '../runner';
import type { CommandMessage } from './command-message';

/**
 * 監視するメッセージの抽象。
 *
 * @export
 * @interface Observable
 */
export interface TypoObservable {
  /**
   * メッセージの作成者。
   *
   * @type {string}
   * @memberof Observable
   */
  readonly authorId: Snowflake;
  /**
   * メッセージの内容。
   *
   * @type {string}
   * @memberof Observable
   */
  readonly content: string;
}

/**
 * Typo を記録/消去する抽象。
 *
 * @export
 * @interface TypoRepository
 */
export interface TypoRepository {
  /**
   * `id` に対応した新しい Typo を追加する。
   *
   * @param {string} newTypo
   * @returns {Promise<void>}
   * @memberof TypoRepository
   */
  addTypo(id: Snowflake, newTypo: string): Promise<void>;

  /**
   * `id` に対応した Typo 一覧を日時順で取得する。
   *
   * @returns {Promise<readonly string[]>}
   * @memberof TypoRepository
   */
  allTyposByDate(id: Snowflake): Promise<readonly string[]>;

  /**
   * Typo をすべて消去する。
   *
   * @returns {Promise<void>}
   * @memberof TypoRepository
   */
  clear(): Promise<void>;
}

/**
 * 「だカス」で終わるメッセージを, それを取り除いて記録する。
 *
 * @export
 * @class TypoRecorder
 * @implements {MessageEventResponder<TypoObservable>}
 */
export class TypoRecorder implements MessageEventResponder<TypoObservable> {
  constructor(private readonly repo: TypoRepository) {}

  async on(event: MessageEvent, message: TypoObservable): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }
    const { authorId: id, content } = message;
    if (!content.endsWith('だカス')) {
      return;
    }
    await this.repo.addTypo(id, content.trim().slice(0, -3));
  }
}

const next6OClock = (clock: Clock) => {
  const now = clock.now();
  const nextDay = addDays(now, 1);
  const nextDay6 = setHours(nextDay, 6);
  return setMinutes(nextDay6, 0);
};

const typoRecordResetTask =
  (repo: TypoRepository, clock: Clock): ScheduleTask =>
  async () => {
    await repo.clear();
    return next6OClock(clock);
  };

/**
 * `typo` コマンドで今日の Typo 一覧を返信する。
 *
 * @export
 * @class TypoReporter
 * @implements {MessageEventResponder<CommandMessage>}
 */
export class TypoReporter implements MessageEventResponder<CommandMessage> {
  constructor(
    private readonly repo: TypoRepository,
    clock: Clock,
    scheduleRunner: ScheduleRunner
  ) {
    scheduleRunner.runOnNextTime(
      this,
      typoRecordResetTask(repo, clock),
      next6OClock(clock)
    );
  }

  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }
    const { sender, args } = message;
    if (args.length < 1 || args[0] !== 'typo') {
      return;
    }
    const description = (await this.repo.allTyposByDate(sender))
      .map((typo) => `- ${typo}`)
      .join('\n');
    await message.reply({
      title: `† 今日の${sender}のtypo †`,
      description
    });
  }
}
