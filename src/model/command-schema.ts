export interface ParamBase {
  name: string;
  description: string;
}

/**
 * 真偽値の引数のスキーマ。`defaultValue` が未定義ならば必須の引数になる。
 */
export interface BooleanParam extends ParamBase {
  type: 'BOOLEAN';
  defaultValue?: boolean;
}

/**
 * 文字列の引数のスキーマ。`defaultValue` が未定義ならば必須の引数になる。
 *
 * `minLength` や `maxLength` で文字列長の最小値と最大値を指定できる。長さが指定された範囲の外ならばパースに失敗する。
 */
export interface StringParam extends ParamBase {
  type: 'STRING';
  defaultValue?: string;
  minLength?: number;
  maxLength?: number;
}

/**
 * ユーザなどの ID の引数のスキーマ。`defaultValue` が未定義ならば必須の引数になる。
 */
export interface SnowflakeParam extends ParamBase {
  type: 'USER' | 'CHANNEL' | 'ROLE' | 'MESSAGE';
  defaultValue?: string;
}

/**
 * 数値の引数のスキーマ。`defaultValue` が未定義ならば必須の引数になる。
 *
 * `type` が `INTEGER` のとき、数字以外を含む文字列ならばパースに失敗する。
 *
 * `minLength` や `maxLength` で数値の最小値と最大値を指定できる。長さが指定された範囲の外ならばパースに失敗する。
 */
export interface NumberParam extends ParamBase {
  type: 'INTEGER' | 'FLOAT';
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
}

/**
 * 選択式の引数のスキーマ。`defaultValue` が未定義ならば必須の引数になる。パース結果は、対応する `choices` 内の文字列のインデックスである。
 *
 * `choices` の中に存在しない文字列ならばパースに失敗する。
 */
export interface ChoicesParam extends ParamBase {
  type: 'CHOICES';
  defaultValue?: number;
  choices: readonly string[];
}

/**
 * 可変長引数のスキーマ。`defaultValue` が未定義ならば必須の引数になる。引数リストの中では一番最後の位置にのみ置ける。
 */
export interface VariadicParam extends ParamBase {
  type: 'VARIADIC';
  defaultValue?: readonly string[];
}

export type Param =
  | BooleanParam
  | StringParam
  | SnowflakeParam
  | NumberParam
  | ChoicesParam
  | VariadicParam;
export type ParamType = Param['type'];
/**
 * 引数のスキーマ `P` に対応するパース結果の型を返す。
 *
 * @typeParam P - 引数のスキーマの型
 */
export type ParamValue<P extends Param> = P extends BooleanParam
  ? boolean
  : P extends NumberParam | ChoicesParam
  ? number
  : P extends VariadicParam
  ? string[]
  : string;

// From https://github.com/type-challenges/type-challenges/blob/48346888871d9fdbbd7b315ad73a529987dd59a1/utils/index.d.ts#L7-L9
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

export type ParamsValues<S> = Equal<S, readonly Param[]> extends true
  ? unknown[]
  : S extends readonly [infer H, ...infer R]
  ? H extends Param
    ? [ParamValue<H>, ...ParamsValues<R>]
    : []
  : [];

/**
 * コマンドの中で分岐する細かいサブコマンド。
 *
 * `params` は引数を受け取る順番で並べたスキーマの配列で指定する。必須の引数は他のどの任意の引数よりも前に登場しなければならない。可変長引数は最後にのみ登場しなければならない。
 */
export interface SubCommand {
  type: 'SUB_COMMAND';
  params?: readonly Param[];
}

export const isValidSubCommand = (sc: SubCommand): boolean => {
  if (!sc.params) {
    return true;
  }
  const variadicIndex = sc.params.findIndex(
    (param) => param.type === 'VARIADIC'
  );
  if (variadicIndex !== -1 && variadicIndex !== sc.params.length - 1) {
    return false;
  }
  const lastRequiredParam = sc.params.reduce(
    (prev, curr, idx) => ('defaultValue' in curr ? prev : idx),
    0
  );
  const firstOptionalParam = sc.params.reduceRight(
    (prev, curr, idx) => ('defaultValue' in curr ? idx : prev),
    sc.params.length
  );
  return lastRequiredParam < firstOptionalParam;
};

export const assertValidSubCommand = (sc: SubCommand): void => {
  if (!isValidSubCommand(sc)) {
    console.dir(sc);
    throw new Error('assertion failure');
  }
};

export type SubCommandEntries = Record<string, SubCommand | SubCommandGroup>;

/**
 * サブコマンドが属するグループ。これ単体ではコマンドとして実行できない。
 */
export interface SubCommandGroup {
  type: 'SUB_COMMAND_GROUP';
  subCommands: SubCommandEntries;
}

/**
 * コマンドの引数のスキーマ。
 *
 * `names` はこのコマンド実行に利用可能な全てのコマンド名、`subCommands` はこの配下にあるサブコマンドである。
 */
export interface Schema {
  names: readonly string[];
  subCommands: SubCommandEntries;
  params?: readonly Param[];
}

/**
 * コマンドのスキーマ `S` に対応するパース結果の型を返す。
 *
 * @typeParam S - コマンドスキーマの型
 */
export type ParsedSchema<S extends Schema> = {
  name: S['names'][number];
  subCommand?: ParsedSubCommand<S['subCommands']>;
  params: ParamsValues<S['params']>;
};

/**
 * コマンドのスキーマ `S` の引数のみに対応するパース結果の型を返す。
 *
 * @typeParam S - コマンドスキーマの型
 */
export type ParsedParameter<S> = S extends SubCommand
  ? {
      type: 'PARAMS';
      params: ParamsValues<Params<S>>;
    }
  : S extends SubCommandGroup
  ? {
      type: 'SUB_COMMAND';
      subCommand: ParsedSubCommand<SubCommands<S>>;
    }
  : never;

export type HasSubCommand = Schema | SubCommandGroup;

/**
 * コマンドのスキーマ `S` のサブコマンドのみに対応するパース結果の型を返す。
 *
 * @typeParam S - コマンドスキーマの型
 */
export type ParsedSubCommand<E> = {
  [K in keyof E]: {
    name: K;
  } & ParsedParameter<E[K]>;
}[keyof E];

export type Params<S> = S extends { params: readonly Param[] }
  ? S['params']
  : never;

export type SubCommands<S> = S extends { subCommands: SubCommandEntries }
  ? S['subCommands']
  : never;

/**
 * パース結果のエラーを表す型。
 */
export type ParseError =
  | [type: 'INVALID_DATA', expected: ParamType, but: unknown]
  | [type: 'NEED_MORE_ARGS']
  | [
      type: 'OUT_OF_RANGE',
      min: number | undefined,
      max: number | undefined,
      but: unknown
    ]
  | [type: 'UNKNOWN_CHOICE', choices: readonly string[], but: unknown]
  | [type: 'UNKNOWN_COMMAND', subCommands: readonly string[], but: unknown]
  | [type: 'OTHERS', message: string];

export const makeError = (error: ParseError): Error => {
  let message: string;
  switch (error[0]) {
    case 'INVALID_DATA':
      message = `\`${error[1]}\` 型の値を期待したけど、\`${String(
        error[2]
      )}\` がやって来たよ`;
      break;
    case 'NEED_MORE_ARGS':
      message = `このコマンドの実行にはもっと引数が必要みたい`;
      break;
    case 'OUT_OF_RANGE':
      message = `値 \`${String(error[3])}\` が範囲 \`${
        error[1] ?? '-∞'
      }\` ~ \`${error[2] ?? '∞'}\` の外だったよ`;
      break;
    case 'UNKNOWN_CHOICE':
      message = `\`${String(error[2])}\` が選択肢 ${error[1]
        .map((command) => `\`${command}\``)
        .join(', ')} の中に無いよ`;
      break;
    case 'UNKNOWN_COMMAND':
      message = `コマンド \`${String(
        error[2]
      )}\` は利用可能なコマンド ${error[1]
        .map((command) => `\`${command}\``)
        .join(', ')} の中に無いよ`;
      break;
    case 'OTHERS':
      message =
        '不明なエラーが発生しちゃった。多分バグだよ。バグ報告はこちらから https://github.com/approvers/OreOreBot2/issues/new/choose';
      break;
  }
  return new Error(message);
};
