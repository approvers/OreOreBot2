import { expect, test } from 'vitest';

import { parseStrings } from './schema.js';

const TIME_OPTION = [{ name: 'at', type: 'STRING' }] as const;

const SCHEMA = {
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

test('single arg', () => {
  const noParamRes = parseStrings(['kaere'], SCHEMA);

  expect(noParamRes).toStrictEqual(['Err', ['NEED_MORE_ARGS']]);

  const oneParamRes = parseStrings(['kaere', 'start'], SCHEMA);

  expect(oneParamRes).toStrictEqual([
    'Ok',
    {
      name: 'kaere',
      subCommand: {
        name: 'start',
        type: 'PARAMS',
        params: []
      }
    }
  ]);

  const subCommandRes = parseStrings(
    ['kaere', 'reserve', 'add', '01:12'],
    SCHEMA
  );

  expect(subCommandRes).toStrictEqual([
    'Ok',
    {
      name: 'kaere',
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
