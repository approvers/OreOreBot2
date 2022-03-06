import type { MessageEvent, MessageEventResponder } from '../runner';
import type { CommandMessage } from './command-message';

/**
 * `JudgementCommand` のための乱数生成器。
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

const JUDGEMENT_TITLE = '***†HARACHO ONLINE JUDGEMENT SYSTEM†***';

/**
 * `judge` コマンドで競技プログラミングの判定をシミュレートする。
 *
 * @export
 * @class JudgementCommand
 * @implements {MessageEventResponder<CommandMessage>}
 */
export class JudgementCommand implements MessageEventResponder<CommandMessage> {
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
    if (Number.isNaN(count) || count <= 0) {
      await message.reply({
        title: '回数の指定が正の整数じゃないよ。'
      });
      return;
    }
    const willBeAccepted = result === 'AC';

    if (willBeAccepted) {
      await this.accept(message, count);
    } else {
      await this.reject(message, count, errorFromStartArg, result);
    }
  }

  private async accept(message: CommandMessage, count: number) {
    const sent = await message.reply({
      title: JUDGEMENT_TITLE,
      description: `0 / ${count} WJ`
    });

    for (let i = 1; i <= count - 1; ++i) {
      await sent.edit({
        title: JUDGEMENT_TITLE,
        description: `${i} / ${count} WJ`
      });
      await this.rng.sleep();
    }
    await sent.edit({
      title: JUDGEMENT_TITLE,
      description: `${count} / ${count} AC`
    });
  }

  private async reject(
    message: CommandMessage,
    count: number,
    errorFromStartArg: string,
    result: string
  ) {
    const sent = await message.reply({
      title: JUDGEMENT_TITLE,
      description: `0 / ${count} WJ`
    });

    const errorFromStart = errorFromStartArg == '-all';
    const errorAt = errorFromStart ? 1 : this.rng.uniform(1, count + 1);

    for (let i = 1; i <= count - 1; ++i) {
      await sent.edit({
        title: JUDGEMENT_TITLE,
        description: `${i} / ${count} ${errorAt <= i ? result : 'WJ'}`
      });
      await this.rng.sleep();
    }
    await sent.edit({
      title: JUDGEMENT_TITLE,
      description: `${count} / ${count} ${result}`
    });
  }
}
