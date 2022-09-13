import type {
  Param,
  ParamsValues,
  ParseError,
  ParsedSchema,
  ParsedSubCommand,
  Schema,
  SubCommand,
  SubCommandEntries,
  SubCommandGroup
} from '../../../../model/command-schema.js';

const DIGITS = /^\d$/;

const hasOwn = <O extends Record<PropertyKey, unknown>>(
  object: O,
  key: PropertyKey
): key is keyof O => Object.hasOwn(object, key);

const parseParams = <P extends readonly Param[]>(
  args: string[],
  schema: Schema<Record<string, unknown>, P> | SubCommand<P>
): ['Ok', ParamsValues<P>] | ['Err', ParseError] => {
  if (!schema.params) {
    return ['Ok', [] as ParamsValues<P>];
  }
  const values: unknown[] = [];
  for (const param of schema.params) {
    const arg = args.shift();
    if (!arg) {
      if (param.defaultValue === undefined) {
        return ['Err', ['NEED_MORE_ARGS']];
      }
      values.push(param.defaultValue);
      continue;
    }
    switch (param.type) {
      case 'BOOLEAN': {
        const lowerArg = arg.toLowerCase();
        if (lowerArg === 'true' || lowerArg === 'yes') {
          values.push(true);
          break;
        }
        if (lowerArg === 'false' || lowerArg === 'no') {
          values.push(false);
          break;
        }
        return ['Err', ['INVALID_DATA', 'BOOLEAN', arg]];
      }
      case 'STRING':
        if (
          (param.minLength && arg.length < param.minLength) ||
          (param.maxLength && param.maxLength < arg.length)
        ) {
          return [
            'Err',
            ['OUT_OF_RANGE', param.minLength, param.maxLength, arg]
          ];
        }
        values.push(arg);
        break;
      case 'USER':
      case 'CHANNEL':
      case 'ROLE':
        if (!DIGITS.test(arg)) {
          return ['Err', ['INVALID_DATA', param.type, arg]];
        }
        values.push(arg);
        break;
      case 'INTEGER': {
        if (!DIGITS.test(arg)) {
          return ['Err', ['INVALID_DATA', 'INTEGER', arg]];
        }
        const parsed = Number.parseInt(arg, 10);
        if (
          (param.minValue && parsed < param.minValue) ||
          (param.maxValue && param.maxValue < parsed)
        ) {
          return ['Err', ['OUT_OF_RANGE', param.minValue, param.maxValue, arg]];
        }
        values.push(parsed);
        break;
      }
      case 'FLOAT': {
        const parsed = Number.parseFloat(arg);
        if (Number.isNaN(parsed)) {
          return ['Err', ['INVALID_DATA', 'FLOAT', arg]];
        }
        if (
          (param.minValue && parsed < param.minValue) ||
          (param.maxValue && param.maxValue < parsed)
        ) {
          return ['Err', ['OUT_OF_RANGE', param.minValue, param.maxValue, arg]];
        }
        values.push(parsed);
        break;
      }
      case 'CHOICES':
        if (!param.choices.includes(arg)) {
          return ['Err', ['UNKNOWN_CHOICE', param.choices, arg]];
        }
        values.push(param.choices.indexOf(arg));
        break;
    }
  }
  return ['Ok', values as ParamsValues<P>];
};

const parseSubCommand = <E>(
  args: string[],
  schema: Schema<E> | SubCommandGroup<E>
): ['Ok', ParsedSubCommand<E>] | ['Err', ParseError] => {
  const subCommandNames = Object.getOwnPropertyNames(schema.subCommands);
  const arg = args.shift();

  if (!arg) {
    return ['Err', ['NEED_MORE_ARGS']];
  }

  if (subCommandNames.includes(arg)) {
    if (!hasOwn(schema.subCommands, arg)) {
      return ['Err', ['UNKNOWN_COMMAND', Object.keys(schema.subCommands), arg]];
    }
    const subCommandKey: keyof E = arg;

    const subCommand = schema.subCommands[subCommandKey];
    if (
      !(
        typeof subCommand === 'object' &&
        subCommand !== null &&
        'type' in subCommand
      )
    ) {
      return ['Err', ['OTHERS', 'unreachable']];
    }
    if (subCommand['type'] === 'SUB_COMMAND_GROUP') {
      const subSubCommand = parseSubCommand(
        args,
        subCommand as SubCommandGroup<SubCommandEntries>
      );
      if (subSubCommand[0] === 'Err') {
        return subSubCommand;
      }
      return [
        'Ok',
        {
          name: subCommandKey,
          parsed: {
            type: 'SUB_COMMAND',
            subCommand: subSubCommand[1]
          }
        } as ParsedSubCommand<E>
      ];
    }
    const params = parseParams(args, subCommand);
    if (params[0] === 'Err') {
      return params;
    }
    return [
      'Ok',
      {
        name: subCommandKey,
        parsed: {
          type: 'PARAMS',
          params: params[1]
        }
      } as ParsedSubCommand<E>
    ];
  }
  return ['Err', ['UNKNOWN_COMMAND', Object.keys(schema.subCommands), arg]];
};

export const parseStrings = <
  E,
  P extends readonly Param[],
  S extends Schema<E, P>
>(
  args: string[],
  schema: S
): ['Ok', ParsedSchema<S>] | ['Err', ParseError] => {
  const name = args.shift();
  if (typeof name !== 'string' || name === '') {
    return ['Err', ['INVALID_DATA', 'STRING', name]];
  }

  const hasSubCommand =
    Object.getOwnPropertyNames(schema.subCommands).length !== 0;

  if (!hasSubCommand) {
    return ['Ok', { name }];
  }
  const subCommand = parseSubCommand(args, schema);
  if (subCommand[0] === 'Ok') {
    return [
      'Ok',
      {
        name,
        subCommand: subCommand[1]
      }
    ];
  }
  if (schema.params) {
    const params = parseParams(args, schema);
    return [
      'Ok',
      {
        name,
        params
      } as ParsedSchema<S>
    ];
  }
  return subCommand;
};
