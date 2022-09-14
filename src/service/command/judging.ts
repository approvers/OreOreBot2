import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';
import {
  emojiOf,
  hasNoTestCases,
  isJudgingStatus,
  waitingJudgingEmoji
} from '../../model/judging-status.js';

import type { MessageEvent } from '../../runner/index.js';

/**
 * `JudgingCommand` のための乱数生成器。
 *
 * @export
 * @interface RandomGenerator
 */
export interface RandomGenerator {
  /**
   * ランダムに少しの間だけ待ってから解決する `Promise` を返す。
   *
   * @returns {Promise<void>}
   * @memberof RandomGenerator
   */
  sleep(): Promise<void>;

  /**
   * `from` 以上 `to` 未満の一様にランダムな整数を返す。
   *
   * @param {number} from
   * @param {number} to
   * @returns {number}
   * @memberof RandomGenerator
   */
  uniform(from: number, to: number): number;
}

const JUDGING_TITLE = '***†HARACHO ONLINE JUDGING SYSTEM†***';

const SCHEMA = {
  names: ['jd', 'judge'],
  subCommands: {},
  params: [
    {
      type: 'INTEGER',
      name: 'テスト数',
      description: '判定のアニメーションに使うテストケースの数、最大値は 64',
      minValue: 1,
      maxValue: 64,
      defaultValue: 5
    },
    {
      type: 'STRING',
      name: '判定結果',
      description: 'アニメーション終了後の判定',
      defaultValue: 'AC'
    },
    {
      type: 'BOOLEAN',
      name: '全失敗',
      description: 'すべての判定結果を失敗にするかどうか',
      defaultValue: false
    }
  ]
} as const;

/**
 * `judge` コマンドで競技プログラミングの判定をシミュレートする。
 *
 * @export
 * @class JudgingCommand
 * @implements {MessageEventResponder<CommandMessage>}
 */
export class JudgingCommand implements CommandResponder<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: JUDGING_TITLE,
    description: 'プログラムが適格かどうか判定してあげるよ'
  };
  readonly schema = SCHEMA;

  constructor(private readonly rng: RandomGenerator) {}

  async on(
    event: MessageEvent,
    message: CommandMessage<typeof SCHEMA>
  ): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }

    const {
      params: [count, result, errorFromStart]
    } = message.args;

    if (!isJudgingStatus(result)) {
      await this.reject({ message, count, errorFromStart, result });
      return;
    }
    if (result === 'AC') {
      await this.accept(message, count);
      return;
    }
    if (hasNoTestCases(result)) {
      await message.reply({
        title: JUDGING_TITLE,
        description: emojiOf(result)
      });
      return;
    }
    await this.reject({
      message,
      count,
      errorFromStart,
      result: emojiOf(result)
    });
  }

  private async accept(message: CommandMessage<typeof SCHEMA>, count: number) {
    const sent = await message.reply({
      title: JUDGING_TITLE,
      description: `0 / ${count} ${waitingJudgingEmoji}`
    });

    for (let i = 1; i <= count - 1; ++i) {
      await sent.edit({
        title: JUDGING_TITLE,
        description: `${i} / ${count} ${waitingJudgingEmoji}`
      });
      await this.rng.sleep();
    }
    await sent.edit({
      title: JUDGING_TITLE,
      description: `${count} / ${count} ${emojiOf('AC')}`
    });
  }

  private async reject({
    message,
    count,
    errorFromStart,
    result
  }: {
    message: CommandMessage<typeof SCHEMA>;
    count: number;
    errorFromStart: boolean;
    result: string;
  }) {
    const sent = await message.reply({
      title: JUDGING_TITLE,
      description: `0 / ${count} ${waitingJudgingEmoji}`
    });

    const errorAt = errorFromStart ? 1 : this.rng.uniform(1, count + 1);

    for (let i = 1; i <= count - 1; ++i) {
      await sent.edit({
        title: JUDGING_TITLE,
        description: `${i} / ${count} ${
          errorAt <= i ? result : waitingJudgingEmoji
        }`
      });
      await this.rng.sleep();
    }
    await sent.edit({
      title: JUDGING_TITLE,
      description: `${count} / ${count} ${result}`
    });
  }
}
