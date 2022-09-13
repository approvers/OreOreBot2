/**
 * 真偽値の引数のスキーマ。`defaultValue` が未定義ならば必須の引数になる。
 *
 * @export
 * @interface BooleanParam
 */
export interface BooleanParam {
  type: 'BOOLEAN';
  name: string;
  defaultValue?: boolean;
}

/**
 * 文字列の引数のスキーマ。`defaultValue` が未定義ならば必須の引数になる。
 *
 * `minLength` や `maxLength` で文字列長の最小値と最大値を指定できる。長さが指定された範囲の外ならばパースに失敗する。
 *
 * @export
 * @interface StringParam
 */
export interface StringParam {
  type: 'STRING';
  name: string;
  defaultValue?: string;
  minLength?: number;
  maxLength?: number;
}

/**
 * ユーザなどの ID の引数のスキーマ。`defaultValue` が未定義ならば必須の引数になる。
 *
 * @export
 * @interface SnowflakeParam
 */
export interface SnowflakeParam {
  type: 'USER' | 'CHANNEL' | 'ROLE' | 'MESSAGE';
  name: string;
  defaultValue?: string;
}

/**
 * 数値の引数のスキーマ。`defaultValue` が未定義ならば必須の引数になる。
 *
 * `type` が `INTEGER` のとき、数字以外を含む文字列ならばパースに失敗する。
 *
 * `minLength` や `maxLength` で数値の最小値と最大値を指定できる。長さが指定された範囲の外ならばパースに失敗する。
 *
 * @export
 * @interface NumberParam
 */
export interface NumberParam {
  type: 'INTEGER' | 'FLOAT';
  name: string;
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
}

/**
 * 選択式の引数のスキーマ。`defaultValue` が未定義ならば必須の引数になる。パース結果は、対応する `choices` 内の文字列のインデックスである。
 *
 * `choices` の中に存在しない文字列ならばパースに失敗する。
 *
 * @export
 * @interface ChoicesParam
 */
export interface ChoicesParam {
  type: 'CHOICES';
  name: string;
  defaultValue?: number;
  choices: readonly string[];
}

export type Param =
  | BooleanParam
  | StringParam
  | SnowflakeParam
  | NumberParam
  | ChoicesParam;
export type ParamType = Param['type'];
/**
 * 引数のスキーマ `P` に対応するパース結果の型を返す。
 *
 * @export
 * @typedef ParamValue
 * @template P 引数のスキーマの型
 */
export type ParamValue<P extends Param> = P extends BooleanParam
  ? boolean
  : P extends NumberParam | ChoicesParam
  ? number
  : string;

export type ParamsValues<S> = S extends [infer H, ...infer R]
  ? H extends Param
    ? R extends readonly Param[]
      ? [ParamValue<H>, ...ParamsValues<R>]
      : [ParamValue<H>]
    : []
  : [];

/**
 * コマンドの中で分岐する細かいサブコマンド。
 *
 * `params` は引数を受け取る順番で並べたスキーマの配列で指定する。必須の引数は他のどの任意の引数よりも前に登場しなければならない。
 *
 * @export
 * @interface SubCommand
 */
export interface SubCommand<P> {
  type: 'SUB_COMMAND';
  params: P;
}

export const isValidSubCommand = <P extends readonly Param[]>(
  sc: SubCommand<P>
): boolean => {
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

export const assertValidSubCommand = <P extends readonly Param[]>(
  sc: SubCommand<P>
): void => {
  if (!isValidSubCommand(sc)) {
    console.dir(sc);
    throw new Error('assertion failure');
  }
};

export type SubCommandEntries = Record<
  string,
  SubCommand<Param[]> | SubCommandGroup<Record<string, unknown>>
>;

/**
 * サブコマンドが属するグループ。これ単体ではコマンドとして実行できない。
 *
 * @export
 * @interface SubCommandGroup
 */
export interface SubCommandGroup<S> {
  type: 'SUB_COMMAND_GROUP';
  subCommands: Readonly<S>;
}

/**
 * コマンドの引数のスキーマ。
 *
 * `names` はこのコマンド実行に利用可能な全てのコマンド名、`subCommands` はこの配下にあるサブコマンドである。
 *
 * @export
 * @interface Schema
 */
export interface Schema<S = Record<string, unknown>, P = readonly Param[]> {
  names: readonly string[];
  subCommands: Readonly<S>;
  params?: P;
}

/**
 * コマンドのスキーマ `S` に対応するパース結果の型を返す。
 *
 * @export
 * @typedef ParsedSchema
 * @template S コマンドスキーマの型
 */
export type ParsedSchema<S extends Schema> = {
  name: S['names'][number];
  subCommand: ParsedSubCommand<S['subCommands']>;
  params: ParamsValues<S['params']>;
};

/**
 * コマンドのスキーマ `S` の引数のみに対応するパース結果の型を返す。
 *
 * @export
 * @typedef ParsedParameter
 * @template S コマンドスキーマの型
 */
export type ParsedParameter<S> = S extends SubCommand<infer P>
  ? {
      type: 'PARAMS';
      params: ParamsValues<P>;
    }
  : S extends SubCommandGroup<infer R>
  ? R extends SubCommandEntries
    ? {
        type: 'SUB_COMMAND';
        subCommand: ParsedSubCommand<R>;
      }
    : never
  : never;

export type HasSubCommand =
  | Schema<Record<string, never>>
  | SubCommandGroup<Record<string, never>>;

/**
 * コマンドのスキーマ `S` のサブコマンドのみに対応するパース結果の型を返す。
 *
 * @export
 * @typedef ParsedParameter
 * @template S コマンドスキーマの型
 */
export type ParsedSubCommand<E> = {
  [K in keyof E]: {
    name: K;
  } & ParsedParameter<E[K]>;
}[keyof E];

export type SubCommands<S> = S extends Schema<infer C>
  ? C
  : S extends SubCommandGroup<infer C>
  ? C
  : never;

/**
 * パース結果のエラーを表す型。
 *
 * @export
 * @typedef ParseError
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
      message = `${error[1]} 型の値を期待しましたが、${String(
        error[2]
      )} を受け取りました`;
      break;
    case 'NEED_MORE_ARGS':
      message = `このコマンドの実行にはもっと引数が必要です`;
      break;
    case 'OUT_OF_RANGE':
      message = `値 ${String(error[3])} が範囲 ${error[1] ?? '-∞'} ~ ${
        error[2] ?? '∞'
      } の外でした`;
      break;
    case 'UNKNOWN_CHOICE':
      message = `${String(error[2])} が選択肢 ${error[1].join(
        ', '
      )} の中にありませんでした`;
      break;
    case 'UNKNOWN_COMMAND':
      message = `コマンド ${String(
        error[2]
      )} は利用可能なコマンド ${error[1].join(', ')} の中に存在しませんでした`;
      break;
    case 'OTHERS':
      message = '不明なエラーが発生しました';
      break;
  }
  return new Error(message);
};
