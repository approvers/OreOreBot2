import { expect, test } from 'vitest';

import { parseStrings } from './schema.js';

test('no args', () => {
  const SERVER_INFO_SCHEMA = {
    names: ['serverinfo'],
    subCommands: {}
  } as const;

  const noParamRes = parseStrings(['serverinfo'], SERVER_INFO_SCHEMA);

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

  const noParamRes = parseStrings(['kaere'], KAERE_SCHEMA);

  expect(noParamRes).toStrictEqual([
    'Ok',
    {
      name: 'kaere',
      params: []
    }
  ]);

  const oneParamRes = parseStrings(['kaere', 'start'], KAERE_SCHEMA);

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

  const subCommandRes = parseStrings(
    ['kaere', 'reserve', 'add', '01:12'],
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

  const noParamRes = parseStrings(['rolecreate'], ROLE_CREATE_SCHEMA);

  expect(noParamRes).toStrictEqual(['Err', ['NEED_MORE_ARGS']]);

  const oneParamRes = parseStrings(
    ['rolecreate', '0123456789'],
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
