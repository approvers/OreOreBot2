import type { DepRegistry } from '../../driver/dep-registry.js';
import { randomGeneratorKey } from '../../model/random-generator.js';
import type { HelpInfo } from '../../runner/command.js';
import type { CommandMessage, CommandResponderFor } from './command-message.js';

const regExState = /^(?<num>\d+)[dD](?<faces>\d+)$/;

const modes = ['simple', 'verbose'] as const;
const choices = [...modes.map((elem) => elem[0]), ...modes] as const;

const SCHEMA = {
  names: ['d', 'dice'],
  description: 'ダイスが振れるよ',
  subCommands: {},
  params: [
    {
      type: 'STRING',
      name: 'dice',
      description:
        'どのダイスを何個振るかの指定。6面ダイス2個であれば `!dice 2d6`または`!d 2D6`のように入力してね。',
      defaultValue: '1d100'
    },
    {
      type: 'CHOICES',
      name: 'display_mode',
      description:
        '各ダイスの出目を表示させるかどうか。デフォルトは省略します。省略表示: `s`, `simple` 、詳細表示: `v`, `verbose`',
      defaultValue: 0,
      choices: choices
    }
  ]
} as const;

/**
 * 'dice' コマンド。複数のサイコロを同時に振って出目を確認できる。
 */
export class DiceCommand implements CommandResponderFor<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'ダイスロール',
    description: '賽子が振れるみたいだよ',
    pageName: 'dice'
  };
  readonly schema = SCHEMA;

  constructor(private readonly reg: DepRegistry) {}

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const [arg, verbose] = message.args.params;

    const matchResult = regExState.exec(arg);

    if (matchResult == null) {
      await message.reply({
        title: 'コマンド形式エラー',
        description:
          '引数の形は`<num>d<num>`をとる必要があるよ。`<num>`は非負整数にしてね。'
      });
      return;
    }
    const arg1 = matchResult.groups?.num;
    const arg2 = matchResult.groups?.faces;

    if (arg1 === undefined || arg2 === undefined) {
      await message.reply({
        title: 'コマンド形式エラー',
        description:
          '引数の形は`<num>d<num>`をとる必要があるよ。`<num>`は非負整数にしてね。'
      });
      return;
    }

    const diceNum = parseInt(arg1, 10);
    const diceFaces = parseInt(arg2, 10);

    if (
      !(1 <= diceFaces && diceFaces <= 100 && 1 <= diceNum && diceNum <= 20)
    ) {
      await message.reply({
        title: '引数が範囲外だよ',
        description: 'ダイスは非負整数で100面20個以下にしてね。'
      });
      return;
    }

    const diceResult = this.reg
      .get(randomGeneratorKey)
      .roll(diceFaces, diceNum);
    const diceSum = diceResult.reduce((a, x) => a + x);

    switch (verbose % (SCHEMA.params[1].choices.length / 2)) {
      case 0:
        await message.reply({
          title: '運命のダイスロール！',
          description: `${arg} => ${diceSum}`
        });
        break;
      case 1:
        await message.reply({
          title: '運命のダイスロール！',
          description: `${arg} => ${diceSum} = (${diceResult.join(' + ')})`
        });
        break;
    }
  }
}
