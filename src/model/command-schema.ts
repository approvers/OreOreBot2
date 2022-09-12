export interface BooleanParam {
  type: 'BOOLEAN';
  defaultValue?: boolean;
}

export interface StringParam {
  type: 'STRING';
  defaultValue?: string;
  minLength?: number;
  maxLength?: number;
}

export interface SnowflakeParam {
  type: 'USER' | 'CHANNEL' | 'ROLE';
  defaultValue?: string;
}

export interface NumberParam {
  type: 'INTEGER' | 'FLOAT';
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
}

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
export type ParamValue<P extends Param> = P extends BooleanParam
  ? boolean
  : P extends NumberParam | ChoicesParam
  ? number
  : string;

export type ParamValueByKey<P> = {
  [K in keyof P]: P[K] extends Param ? ParamValue<P[K]> : Record<string, never>;
};

export interface SubCommand {
  type: 'SUB_COMMAND';
  params?: Readonly<Record<string, Param>>;
}
export interface SubCommandGroup {
  type: 'SUB_COMMAND_GROUP';
  params?: Readonly<Record<string, Param>>;
  subCommands: Readonly<Record<string, SubCommand>>;
}

export interface Schema {
  names: readonly string[];
  params: Readonly<Record<string, Param>>;
  subCommands: Readonly<Record<string, SubCommand | SubCommandGroup>>;
}

export type ParsedSchema<S> = S extends Record<
  string,
  SubCommand | SubCommandGroup
>
  ? {
      [K in keyof S]: {
        name: K;
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

export type Names<S extends Schema> = S['names'];
export type Params<S extends Schema | SubCommand | SubCommandGroup> =
  S['params'] &
    (S extends infer T
      ? T extends SubCommandGroup
        ? ParsedSchema<SubCommands<T>>
        : Record<string, never>
      : Record<string, never>);
export type SubCommands<S extends Schema | SubCommandGroup> = [S] extends [
  infer T
]
  ? T extends Schema | SubCommandGroup
    ? T['subCommands']
    : never
  : never;

export type ParamsByCommand<
  S extends Record<string, SubCommand | SubCommandGroup>
> = {
  [K in keyof S]: Params<S[K]>;
};
