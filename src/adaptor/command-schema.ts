import type {
  Param,
  Schema,
  SubCommandEntries
} from '../model/command-schema.js';

const entriesToOptions = (entries: SubCommandEntries): unknown[] =>
  Object.keys(entries).map((key) => {
    const entry = entries[key];
    return entry.type === 'SUB_COMMAND'
      ? {
          type: 1, // SUB_COMMAND
          name: key,
          options: entry.params?.map(paramToOption) ?? []
        }
      : {
          type: 2, // SUB_COMMAND_GROUP
          name: key,
          options: entriesToOptions(entry.subCommands)
        };
  });
const paramToOption = (param: Param): unknown => {
  switch (param.type) {
    case 'STRING':
      return {
        type: 3, // STRING
        name: param.name,
        description: param.description,
        required: param.defaultValue === undefined,
        min_length: param.minLength,
        max_length: param.maxLength
      };
    case 'INTEGER':
      return {
        type: 4, // INTEGER
        name: param.name,
        description: param.description,
        required: param.defaultValue === undefined,
        min_value: param.minValue,
        max_value: param.maxValue
      };
    case 'BOOLEAN':
      return {
        type: 5, // BOOLEAN
        name: param.name,
        description: param.description,
        required: param.defaultValue === undefined
      };
    case 'USER':
      return {
        type: 6, // USER
        name: param.name,
        description: param.description,
        required: param.defaultValue === undefined
      };
    case 'CHANNEL':
      return {
        type: 7, // CHANNEL
        name: param.name,
        description: param.description,
        required: param.defaultValue === undefined
      };
    case 'ROLE':
      return {
        type: 8, // ROLE
        name: param.name,
        description: param.description,
        required: param.defaultValue === undefined
      };
    case 'MESSAGE':
      return {
        type: 3, // STRING
        name: param.name,
        description: param.description,
        required: param.defaultValue === undefined
      };
    case 'FLOAT':
      return {
        type: 10, // NUMBER
        name: param.name,
        description: param.description,
        required: param.defaultValue === undefined,
        min_value: param.minValue,
        max_value: param.maxValue
      };
    case 'CHOICES':
      return {
        type: 3, // STRING
        name: param.name,
        description: param.description,
        choices: param.choices.map((choice) => ({
          name: choice,
          value: choice
        })),
        required: param.defaultValue === undefined,
        autocomplete: true
      };
    case 'VARIADIC':
      return {
        type: 3, // STRING
        name: param.name,
        description: param.description,
        required: param.defaultValue === undefined
      };
    default:
      throw new Error('unreachable');
  }
};
export const schemaToDiscordFormat = (schema: Schema): unknown[] =>
  schema.names.flatMap((name) => ({
    name,
    options: entriesToOptions(schema.subCommands).concat(
      schema.params?.map(paramToOption) ?? []
    )
  }));
