import type { ChatInputCommandInteraction, User } from 'discord.js';
import { expect, test } from 'vitest';

import { parseOptions } from './slash.js';

test('no args', () => {
  const SERVER_INFO_SCHEMA = {
    names: ['serverinfo'],
    subCommands: {}
  } as const;

  const noParamRes = parseOptions(
    'serverinfo',
    {} as unknown as ChatInputCommandInteraction['options'],
    SERVER_INFO_SCHEMA
  );

  expect(noParamRes).toStrictEqual([
    'Ok',
    {
      name: 'serverinfo',
      params: []
    }
  ]);
});

test('single arg', () => {
  const TIME_OPTION = [
    { name: 'at', description: '', type: 'STRING' }
  ] as const;
  const KAERE_SCHEMA = {
    names: ['kaere'],
    subCommands: {
      start: {
        type: 'SUB_COMMAND'
      },
      bed: {
        type: 'SUB_COMMAND_GROUP',
        subCommands: {
          enable: {
            type: 'SUB_COMMAND'
          },
          disable: {
            type: 'SUB_COMMAND'
          },
          status: {
            type: 'SUB_COMMAND'
          }
        }
      },
      reserve: {
        type: 'SUB_COMMAND_GROUP',
        subCommands: {
          add: {
            type: 'SUB_COMMAND',
            params: TIME_OPTION
          },
          cancel: {
            type: 'SUB_COMMAND',
            params: TIME_OPTION
          },
          list: {
            type: 'SUB_COMMAND'
          }
        }
      }
    }
  } as const;

  const noParamRes = parseOptions(
    'kaere',
    {
      getSubcommand: () => null,
      getSubcommandGroup: () => null
    } as unknown as ChatInputCommandInteraction['options'],
    KAERE_SCHEMA
  );

  expect(noParamRes).toStrictEqual([
    'Ok',
    {
      name: 'kaere',
      params: []
    }
  ]);

  const oneParamRes = parseOptions(
    'kaere',
    {
      getSubcommand: () => 'start'
    } as unknown as ChatInputCommandInteraction['options'],
    KAERE_SCHEMA
  );

  expect(oneParamRes).toStrictEqual([
    'Ok',
    {
      name: 'kaere',
      params: [],
      subCommand: {
        name: 'start',
        type: 'PARAMS',
        params: []
      }
    }
  ]);

  const subCommandRes = parseOptions(
    'kaere',
    {
      getSubcommandGroup: () => 'reserve',
      getSubcommand: () => 'add',
      getString: () => '01:12'
    } as unknown as ChatInputCommandInteraction['options'],
    KAERE_SCHEMA
  );

  expect(subCommandRes).toStrictEqual([
    'Ok',
    {
      name: 'kaere',
      params: [],
      subCommand: {
        name: 'reserve',
        type: 'SUB_COMMAND',
        subCommand: {
          name: 'add',
          type: 'PARAMS',
          params: ['01:12']
        }
      }
    }
  ]);
});

test('multi args', () => {
  const ROLE_CREATE_SCHEMA = {
    names: ['rolecreate'],
    subCommands: {},
    params: [
      { type: 'USER', name: 'target', description: '' },
      { type: 'STRING', name: 'color', description: '', defaultValue: 'random' }
    ]
  } as const;

  const noParamRes = parseOptions(
    'rolecreate',
    {} as unknown as ChatInputCommandInteraction['options'],
    ROLE_CREATE_SCHEMA
  );

  expect(noParamRes).toStrictEqual(['Err', ['NEED_MORE_ARGS']]);

  const oneParamRes = parseOptions(
    'rolecreate',
    {
      getUser: () => ({ id: '0123456789' }) as unknown as User
    } as unknown as ChatInputCommandInteraction['options'],
    ROLE_CREATE_SCHEMA
  );

  expect(oneParamRes).toStrictEqual([
    'Ok',
    {
      name: 'rolecreate',
      params: ['0123456789', 'random']
    }
  ]);
});
