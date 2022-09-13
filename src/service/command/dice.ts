import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';

import type { MessageEvent } from '../../runner/index.js';

/**
 * 'QueenCommand' のための乱数生成器。
 *
 * @export
 * @interface RandomGenerator
 */
export interface RandomGenerator {
  /**
   *
   * @param {number} from
   * @param {number} to
   * @return {number}
   * @memberOf RandomGenerator
   */
  uniform(from: number, to: number): number;
}

/**
 * 'dice' コマンドで
 *
 * @export
 * @class DiceCommand
 * @implements {MessageEventResponder<CommandMessage>}
 */
export class DiceCommand implements CommandResponder {
  help: Readonly<HelpInfo> = {
    title: 'ダイスの女王様だ',
    description: 'あなたの代わりにダイスを振るよ',
    commandName: ['d', 'dice'],
    argsFormat: [
      {
        name: 'ダイス設定',
        description:
          '{ダイスの最大出目}d{ダイスを振る個数}の形式 6面ダイス3個なら 6d3 みたいに',
        defaultValue: '1d100'
      }
    ]
  };

  constructor(private readonly rng: RandomGenerator) {}

  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }

    const [commandName, diceString = '1d6'] = message.args;
    const diceMessage = diceString;
    if (!['d', 'dice'].includes(commandName)) {
      return;
    }

    const [diceSize, diceQuan] = diceString.split('d').map(Number);
    let diceResult = 0;
    for (let i = 1; i <= diceQuan; ++i) {
      diceResult += this.rng.uniform(1, diceSize);
    }
    await message.reply({
      title: 'ダイスロール(' + diceMessage + ')',
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      description: '(' + diceMessage + ') =>' + diceResult
    });
  }
}
