import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';

/**
 * ダイスの管理者。面白いものの味方。
 * 今後詳細値がほしい場合があるかも知れないので、各ダイスについてどんな出目が出たかを判断する。
 */
export interface DiceQueen {
  /**
   *
   * @param {number} faces
   * @param {number} howManyRolls
   * @return {Array<number>}
   */
  roll(faces: number, howManyRolls: number): Array<number>;
}

const SCHEMA = {
  names: ['d', 'dice'],
  subCommands: {},
  params: [
    {
      type: 'STRING',
      name: 'ダイスロール設定',
      description:
        'どのダイスを何個振るかの指定。6面ダイス2個であれば ‘!dice 2d6`または`!d 2D6`のように入力してね。',
      defaultValue: '1d100'
    },
    {
      type: 'CHOICES',
      name: '詳細表示',
      description: '各ダイスの出目を表示させるかどうか。',
      defaultValue: 0,
      choices: ['s', 'v', 'simple', 'verbose']
    }
  ]
} as const;

const regExState = /^(?<num>\d+)[dD](?<faces>\d+)$/;

/**
 * 'dice' コマンドで
 *
 * @export
 * @class DiceCommand
 * @implements {MessageEventResponder<CommandMessage>}
 */
export class DiceCommand implements CommandResponder<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'ダイスロール',
    description: '賽子が振れるみたいだよ'
  };
  readonly schema = SCHEMA;

  constructor(private readonly diceQueen: DiceQueen) {}

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

    const diceResult = this.diceQueen.roll(diceFaces, diceNum);
    const diceSum = diceResult.reduce((a, x) => a + x);

    if (verbose === 1 || verbose === 3) {
      await message.reply({
        title: '運命のダイスロール！',
        description: `${arg} => ${diceSum} = (${diceResult.join(' + ')})`
      });
    }

    if (verbose === 0 || verbose === 2) {
      await message.reply({
        title: '運命のダイスロール！',
        description: `${arg} => ${diceSum}`
      });
    }
  }
}
