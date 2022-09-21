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
   * @param {number} HowManyRoll
   * @return {Array<number>}
   */
  roll(faces: number, HowManyRoll: number): Array<number>;
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
    const [arg] = message.args.params;

    const matchResult = regExState.exec(arg);

    if (matchResult == null) {
      await message.reply({
        title: 'コマンド形式エラー',
        description: '引数の形は`<num>d<num>`をとる必要があるよ。'
      });
      return;
    }
    const arg1 = matchResult.groups?.num;
    const arg2 = matchResult.groups?.faces;

    if (!(arg1 !== undefined && arg2 !== undefined)) {
      await message.reply({
        title: 'コマンド形式エラー',
        description: '引数の形は`<num>d<num>`をとる必要があるよ。'
      });
      return;
    }

    const diceNum = parseInt(arg1, 10);
    const diceFaces = parseInt(arg2, 10);

    if (
      !(
        1 <= diceFaces &&
        diceFaces <= 100 &&
        1 <= diceNum &&
        diceNum <= 20 &&
        1 <= diceFaces * diceNum &&
        diceFaces * diceNum <= 2000
      )
    ) {
      await message.reply({
        title: '引数が範囲外だよ',
        description:
          'ダイスは非負整数で100面20個以下、最大値が2000までの処理にしてね。'
      });
      return;
    }

    const diceResult = this.diceQueen.roll(diceFaces, diceNum);
    const diceSum = diceResult.reduce((a, x) => a + x);

    await message.reply({
      title: '運命のダイスロール！',
      description: `${arg} => ${diceSum}`
    });
  }
}
