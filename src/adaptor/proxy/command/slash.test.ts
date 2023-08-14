import type { ChatInputCommandInteraction } from 'discord.js';
import { expect, test } from 'vitest';

import { parseOptions } from './slash.js';

test('no args', () => {
  const SERVER_INFO_SCHEMA = {
    names: ['guildinfo', 'serverinfo', 'guild', 'server'],
    description: '限界開発鯖の情報を持ってくるよ',
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
  const TIME_OPTIONS = [
    { name: 'at', description: '', type: 'STRING' }
  ] as const;
  const KAERE_SCHEMA = {
    names: ['kaere'],
    description: 'VC内の人類に就寝を促すよ',
    subCommands: {
      bed: {
        type: 'SUB_COMMAND_GROUP',
        description: '強制切断モードを取り扱うよ',
        subCommands: {
          enable: {
            type: 'SUB_COMMAND',
            description: '強制切断モードを有効化するよ'
          },
          disable: {
            type: 'SUB_COMMAND',
            description: '強制切断モードを無効化するよ'
          },
          status: {
            type: 'SUB_COMMAND',
            description: '現在の強制切断モードの設定を確認するよ'
          }
        }
      },
      reserve: {
        type: 'SUB_COMMAND_GROUP',
        description: '予約システムを取り扱うよ',
        subCommands: {
          add: {
            type: 'SUB_COMMAND',
            description: '指定の時刻で予約するよ',
            params: TIME_OPTIONS
          },
          cancel: {
            type: 'SUB_COMMAND',
            description: '指定時刻の予約をキャンセルするよ',
            params: TIME_OPTIONS
          },
          list: {
            type: 'SUB_COMMAND',
            description: '現在の予約を一覧するよ'
          }
        }
      }
    }
  } as const;

  const noParamRes = parseOptions(
    'kaere',
    {
      data: [],
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

  const subCommandRes = parseOptions(
    'kaere',
    {
      data: [{}, {}, {}],
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
    description: 'ロールを作成するよ',
    subCommands: {},
    params: [
      {
        type: 'STRING',
        name: 'name',
        description: '作成するロールの名前を指定してね'
      },
      {
        type: 'STRING',
        name: 'color',
        description:
          '作成するロールの色を[HEX](https://htmlcolorcodes.com/)で指定してね'
      }
    ]
  } as const;

  const noParamRes = parseOptions(
    'rolecreate',
    {
      getString: () => null
    } as unknown as ChatInputCommandInteraction['options'],
    ROLE_CREATE_SCHEMA
  );

  expect(noParamRes).toStrictEqual(['Err', ['NEED_MORE_ARGS']]);

  let count = 0;
  const oneParamRes = parseOptions(
    'rolecreate',
    {
      getString: () => {
        ++count;
        if (count === 1) {
          return '0123456789';
        }
        if (count === 2) {
          return '#bedead';
        }
        return null;
      }
    } as unknown as ChatInputCommandInteraction['options'],
    ROLE_CREATE_SCHEMA
  );

  expect(oneParamRes).toStrictEqual([
    'Ok',
    {
      name: 'rolecreate',
      params: ['0123456789', '#bedead']
    }
  ]);
});
