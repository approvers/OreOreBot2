import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message';
import {
  emojiOf,
  hasNoTestCases,
  isJudgingStatus,
  waitingJudgingEmoji
} from '../model/judging-status';
import type { MessageEvent } from '../runner';

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

/**
 * `judge` コマンドで競技プログラミングの判定をシミュレートする。
 *
 * @export
 * @class JudgingCommand
 * @implements {MessageEventResponder<CommandMessage>}
 */
export class JudgingCommand implements CommandResponder {
  help: Readonly<HelpInfo> = {
    title: JUDGING_TITLE,
    description: 'プログラムが適格かどうか判定してあげるよ',
    commandName: ['jd', 'judge'],
    argsFormat: [
      {
        name: 'テストケースの数',
        description: '判定のアニメーションに使うテストケースの数、最大値は 64',
        defaultValue: '5'
      },
      {
        name: '判定結果',
        description: 'アニメーション終了後の判定',
        defaultValue: 'AC'
      }
    ]
  };

  constructor(private readonly rng: RandomGenerator) {}

  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }

    const [commandName, countArg = '5', result = 'AC', errorFromStartArg] =
      message.args;
    if (!['jd', 'judge'].includes(commandName)) {
      return;
    }
    const count = parseInt(countArg, 10);
    if (Number.isNaN(count) || count <= 0 || 64 < count) {
      await message.reply({
        title: '回数の指定が 1 以上 64 以下の整数じゃないよ。'
      });
      return;
    }

    if (!isJudgingStatus(result)) {
      await this.reject({ message, count, errorFromStartArg, result });
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
      errorFromStartArg,
      result: emojiOf(result)
    });
  }

  private async accept(message: CommandMessage, count: number) {
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
    errorFromStartArg,
    result
  }: {
    message: CommandMessage;
    count: number;
    errorFromStartArg: string;
    result: string;
  }) {
    const sent = await message.reply({
      title: JUDGING_TITLE,
      description: `0 / ${count} ${waitingJudgingEmoji}`
    });

    const errorFromStart = errorFromStartArg == '-all';
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
