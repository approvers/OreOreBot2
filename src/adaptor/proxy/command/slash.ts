import type { CommandInteractionOptionResolver } from 'discord.js';

import type {
  ParsedSchema,
  ParseError,
  Param,
  ParamsValues,
  ParsedSubCommand,
  SubCommands,
  Schema,
  SubCommandGroup,
  SubCommand,
  Params
} from '../../../model/command-schema.js';

export const parseOptions = <S extends Schema>(
  commandName: string,
  options: Omit<CommandInteractionOptionResolver, 'getMessage' | 'getFocused'>,
  schema: S
): ['Ok', ParsedSchema<S>] | ['Err', ParseError] => {
  const hasSubCommand =
    Object.getOwnPropertyNames(schema.subCommands).length !== 0;

  if (!hasSubCommand) {
    if (schema.params === undefined) {
      return [
        'Ok',
        {
          name: commandName,
          params: []
        } as ParsedSchema<S>
      ];
    }
    const params = parseParams(options, schema.params);
    if (params[0] === 'Err') {
      return params;
    }
    return [
      'Ok',
      {
        name: commandName,
        params: params[1]
      }
    ];
  }

  if (options.data.length === 0) {
    return [
      'Ok',
      {
        name: commandName,
        params: []
      } as ParsedSchema<S>
    ];
  }

  const subCommand = parseSubcommand(options, schema);
  if (subCommand[0] === 'Err') {
    return subCommand;
  }
  return [
    'Ok',
    {
      name: commandName,
      params: [],
      subCommand: subCommand[1]
    } as ParsedSchema<S>
  ];
};

const parseParams = <S extends Schema | SubCommand>(
  options: Omit<CommandInteractionOptionResolver, 'getMessage' | 'getFocused'>,
  params: readonly Param[]
): ['Ok', ParamsValues<Params<S>>] | ['Err', ParseError] => {
  const result: unknown[] = [];
  for (const param of params) {
    switch (param.type) {
      case 'BOOLEAN': {
        const val = options.getBoolean(param.name, false) ?? param.defaultValue;
        if (val === undefined) {
          return ['Err', ['NEED_MORE_ARGS']];
        }
        result.push(val);
        break;
      }
      case 'MESSAGE':
      case 'STRING': {
        const val = options.getString(param.name, false) ?? param.defaultValue;
        if (val === undefined) {
          return ['Err', ['NEED_MORE_ARGS']];
        }
        result.push(val);
        break;
      }
      case 'USER': {
        const val =
          options.getUser(param.name, false)?.id ?? param.defaultValue;
        if (val === undefined) {
          return ['Err', ['NEED_MORE_ARGS']];
        }
        result.push(val);
        break;
      }
      case 'CHANNEL': {
        const val =
          options.getChannel(param.name, false)?.id ?? param.defaultValue;
        if (val === undefined) {
          return ['Err', ['NEED_MORE_ARGS']];
        }
        result.push(val);
        break;
      }
      case 'ROLE': {
        const val =
          options.getRole(param.name, false)?.id ?? param.defaultValue;
        if (val === undefined) {
          return ['Err', ['NEED_MORE_ARGS']];
        }
        result.push(val);
        break;
      }
      case 'INTEGER': {
        const val = options.getInteger(param.name, false) ?? param.defaultValue;
        if (val === undefined) {
          return ['Err', ['NEED_MORE_ARGS']];
        }
        result.push(val);
        break;
      }
      case 'FLOAT': {
        const val = options.getNumber(param.name, false) ?? param.defaultValue;
        if (val === undefined) {
          return ['Err', ['NEED_MORE_ARGS']];
        }
        result.push(val);
        break;
      }
      case 'CHOICES': {
        const val = options.getString(param.name, false);
        if (val === null) {
          if (param.defaultValue !== undefined) {
            const defaultChoice = param.choices[param.defaultValue];
            result.push(defaultChoice);
            break;
          }
          return ['Err', ['NEED_MORE_ARGS']];
        }
        result.push(val);
        break;
      }
      case 'VARIADIC': {
        const val =
          options.getString(param.name, false)?.split(' ') ??
          param.defaultValue;
        if (val === undefined) {
          return ['Err', ['NEED_MORE_ARGS']];
        }
        result.push(val);
        break;
      }
    }
  }
  return ['Ok', result as ParamsValues<Params<S>>];
};

const parseSubcommand = <S extends Schema | SubCommandGroup>(
  options: Omit<CommandInteractionOptionResolver, 'getMessage' | 'getFocused'>,
  schema: S
): ['Ok', ParsedSubCommand<SubCommands<S>>] | ['Err', ParseError] => {
  const subcommand = options.getSubcommand(false);
  const subcommandGroup = options.getSubcommandGroup(false);

  for (const name in schema.subCommands) {
    if (name === subcommandGroup) {
      const groupSchema = schema.subCommands[name] as SubCommandGroup;
      const parsedSubSubCommand = parseSubcommand(options, groupSchema);
      if (parsedSubSubCommand[0] === 'Err') {
        return parsedSubSubCommand;
      }
      return [
        'Ok',
        {
          name,
          type: 'SUB_COMMAND',
          subCommand: parsedSubSubCommand[1]
        } as unknown as ParsedSubCommand<SubCommands<S>>
      ];
    }
    if (name === subcommand) {
      const subCommandSchema = schema.subCommands[name] as SubCommand;
      const parsedParams = parseParams(options, subCommandSchema.params ?? []);
      if (parsedParams[0] === 'Err') {
        return parsedParams;
      }
      return [
        'Ok',
        {
          name,
          type: 'PARAMS',
          params: parsedParams[1]
        } as unknown as ParsedSubCommand<SubCommands<S>>
      ];
    }
  }

  return [
    'Err',
    ['UNKNOWN_COMMAND', [...Object.keys(schema.subCommands)], subcommand]
  ];
};
