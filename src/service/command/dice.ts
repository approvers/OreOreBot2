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
        'どのダイスを何個振るかの指定。6面ダイス2個であれば ‘!dice 2d6`のように入力してね',
      defaultValue: '1d100'
    }
  ]
} as const;

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

    if (arg.match(/^(?!a-c,e-z)*$/)) {
      await message.reply({
        title: 'コマンド形式エラー',
        description: '引数の形は`<num>d<num>`をとる必要があるよ。'
      });
      return;
    }
    const [arg1, arg2] = arg.toLowerCase().split('d', 2);
    const diceFaces = parseInt(arg1);
    const diceNum = parseInt(arg2);

    if (diceFaces >= 20 && diceNum >= 100 && diceFaces * diceNum >= 200) {
      await message.reply({
        title: '引数が大きすぎるよ',
        description: 'ダイスは20面100個以下、最大値が200までの処理にしてね。'
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
