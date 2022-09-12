/**
 * 真偽値の引数のスキーマ。`defaultValue` が未定義ならば必須の引数になる。
 *
 * @export
 * @interface BooleanParam
 */
export interface BooleanParam {
  type: 'BOOLEAN';
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
  type: 'USER' | 'CHANNEL' | 'ROLE';
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
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
}

/**
 * 選択式の引数のスキーマ。`defaultValueIndex` が未定義ならば必須の引数になる。パース結果は、対応する `choices` 内の文字列のインデックスである。
 *
 * `choices` の中に存在しない文字列ならばパースに失敗する。
 *
 * @export
 * @interface ChoicesParam
 */
export interface ChoicesParam {
  type: 'CHOICES';
  defaultValueIndex?: number;
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

export type ParamValueByKey<P> = {
  [K in keyof P]: P[K] extends Param ? ParamValue<P[K]> : Record<string, never>;
};

/**
 * コマンドの中で分岐する細かいサブコマンド。
 *
 * @export
 * @interface SubCommand
 */
export interface SubCommand {
  type: 'SUB_COMMAND';
  params: Readonly<Record<string, Param>>;
}

/**
 * サブコマンドが属するグループ。これ単体ではコマンドとして実行できないが、グループ全体で共通する引数を定義できる。
 *
 * @export
 * @interface SubCommandGroup
 */
export interface SubCommandGroup {
  type: 'SUB_COMMAND_GROUP';
  params: Readonly<Record<string, Param>>;
  subCommands: Readonly<Record<string, SubCommand | SubCommandGroup>>;
}

/**
 * コマンドの引数のスキーマ。
 *
 * `names` はこのコマンド実行に利用可能な全てのコマンド名、`params` はコマンド全体で共通の引数、`subCommands` はこの配下にあるサブコマンドである。
 *
 * @export
 * @interface Schema
 */
export interface Schema {
  names: readonly string[];
  params: Readonly<Record<string, Param>>;
  subCommands: Readonly<Record<string, SubCommand | SubCommandGroup>>;
}

/**
 * コマンドのスキーマ `S` に対応するパース結果の型を返す。
 *
 * @export
 * @typedef ParsedSchema
 * @template S コマンドスキーマの型
 */
export type ParsedSchema<S> = S extends Record<
  string,
  SubCommand | SubCommandGroup
>
  ? {
      [K in keyof S]: {
        key: K;
        value: Params<S[K]>;
      };
    }[keyof S]
  : S extends Schema
  ? {
      name: Names<S>[number];
      params: Params<S>;
      subCommand: ParsedSchema<SubCommands<S>>;
    }
  : never;

type Names<S extends Schema> = S['names'];
type Params<S extends Schema | SubCommand | SubCommandGroup> = S['params'] &
  (S extends infer T
    ? T extends SubCommandGroup
      ? ParsedSchema<SubCommands<T>>
      : Record<string, never>
    : Record<string, never>);
type SubCommands<S extends Schema | SubCommandGroup> = S['subCommands'];
