import type {
  Clock,
  MessageEvent,
  MessageEventResponder,
  ScheduleRunner,
  ScheduleTask
} from '../../runner/index.js';
import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';
import { addDays, setHours, setMinutes } from 'date-fns';

import type { Snowflake } from '../../model/id.js';

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
    const sliced = content.trim().slice(0, -3);
    if (sliced === '') {
      return;
    }
    await this.repo.addTypo(id, sliced);
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

const SCHEMA = {
  names: ['typo'],
  subCommands: {
    by: {
      type: 'SUB_COMMAND',
      params: [
        {
          type: 'USER',
          name: '表示するユーザID',
          description:
            'この後にユーザ ID を入れると, そのユーザ ID の今日の Typo を表示するよ',
          defaultValue: 'me'
        }
      ]
    }
  }
} as const;

/**
 * `typo` コマンドで今日の Typo 一覧を返信する。
 *
 * @export
 * @class TypoReporter
 * @implements {MessageEventResponder<CommandMessage>}
 */
export class TypoReporter implements CommandResponder<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: '今日のTypo',
    description: '「〜だカス」をTypoとして一日間記録するよ'
  };
  readonly schema = SCHEMA;

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

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const { senderId, senderName, args } = message;

    if (!args.subCommand) {
      await this.replyTypos(message, senderId, senderName);
      return;
    }
    const [userId] = args.subCommand.params;
    await this.replyTypos(message, userId as Snowflake, `<@${userId}>`);
  }

  private async replyTypos(
    message: CommandMessage<typeof SCHEMA>,
    senderId: Snowflake,
    senderName: string
  ) {
    const typos = await this.repo.allTyposByDate(senderId);
    const description =
      `***† 今日の${senderName}のtypo †***\n` +
      typos.map((typo) => `- ${typo}`).join('\n');
    await message.reply({
      description
    });
  }
}
