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
  const DICE_SCHEMA = {
    names: ['d', 'dice'],
    description: 'ダイスが振れるよ',
    subCommands: {},
    params: [
      {
        type: 'STRING',
        name: 'dice',
        description:
          'どのダイスを何個振るかの指定。6面ダイス2個であれば `!dice 2d6`または`!d 2D6`のように入力してね。',
        defaultValue: '1d100'
      },
      {
        type: 'CHOICES',
        name: 'display_mode',
        description:
          '各ダイスの出目を表示させるかどうか。デフォルトは省略します。省略表示: `s`, `simple` 、詳細表示: `v`, `verbose`',
        defaultValue: 0,
        choices: ['s', 'v', 'simple', 'verbose']
      }
    ]
  } as const;

  function argsToOptions(args: (string | undefined)[]) {
    return {
      index: 0,
      getString() {
        const ret = args[this.index] ?? null;
        ++this.index;
        return ret;
      }
    };
  }

  const noParamRes = parseOptions(
    'd',
    argsToOptions([
      '1d100'
    ]) as unknown as ChatInputCommandInteraction['options'],
    DICE_SCHEMA
  );

  expect(noParamRes).toStrictEqual([
    'Ok',
    {
      name: 'd',
      params: ['1d100', 0]
    }
  ]);

  const oneParamRes = parseOptions(
    'dice',
    argsToOptions([
      '2d6',
      'verbose'
    ]) as unknown as ChatInputCommandInteraction['options'],
    DICE_SCHEMA
  );

  expect(oneParamRes).toStrictEqual([
    'Ok',
    {
      name: 'dice',
      params: ['2d6', 3]
    }
  ]);
});
