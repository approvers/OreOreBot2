import { expect, test } from 'vitest';

import { parseStrings } from './schema.js';

const TIME_OPTION = [{ name: 'at', type: 'STRING' }] as const;

const SCHEMA = {
  names: ['kaere'],
  subCommands: {
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

test('simple', () => {
  const expected = {
    name: 'kaere',
    subCommand: {
      key: 'reserve',
      subCommand: {
        key: 'add',
        param: {
          at: '01:12'
        }
      }
    }
  };

  const res = parseStrings(['kaere', 'reserve', 'add', '01:12'], SCHEMA);

  expect(res[1]).toStrictEqual(expected);
});
