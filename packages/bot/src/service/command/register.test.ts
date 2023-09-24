import { expect, test, vi } from 'vitest';

import type { Schema } from '../../model/command-schema.js';
import type { Snowflake } from '../../model/id.js';
import {
  CommandRunner,
  emptyProxy,
  type CommandResponder
} from '../../runner/command.js';
import { PingCommand } from './ping.js';
import {
  registerCommands,
  type CommandRepository,
  type Command,
  type RegisteredCommand
} from './register.js';
import { GetVersionCommand } from './version.js';

test('', async () => {
  const createCommand = vi.fn<[Command], Promise<void>>(() =>
    Promise.resolve()
  );
  const updateCommand = vi.fn<[RegisteredCommand], Promise<void>>(() =>
    Promise.resolve()
  );
  const deleteCommand = vi.fn<[Snowflake], Promise<void>>(() =>
    Promise.resolve()
  );

  const commandRepo: CommandRepository = {
    currentCommands: () =>
      Promise.resolve([
        {
          id: '0001' as Snowflake,
          name: 'hoge',
          x: {
            foo: 2
          }
        },
        {
          id: '0002' as Snowflake,
          description: '現在の私のバージョンを出力するよ！',
          name: 'version',
          options: undefined
        }
      ]),
    createCommand,
    updateCommand,
    deleteCommand
  };
  const commandRunner = new CommandRunner(emptyProxy);
  commandRunner.addResponder(
    new GetVersionCommand({
      version: 'v0.1.0'
    }) as unknown as CommandResponder<Schema>
  );
  commandRunner.addResponder(
    new PingCommand({
      avgPing: 160
    }) as unknown as CommandResponder<Schema>
  );
  await registerCommands({ commandRepo, commandRunner });

  expect(createCommand).toHaveBeenCalledWith({
    description: '現在のレイテンシを表示するよ',
    name: 'ping',
    options: undefined
  });
  expect(createCommand).toHaveBeenCalledOnce();
  expect(updateCommand).toHaveBeenCalledWith({
    id: '0002' as Snowflake,
    description: '現在の私のバージョンを出力するよ！',
    name: 'version',
    options: undefined
  });
  expect(updateCommand).toHaveBeenCalledOnce();
  expect(deleteCommand).toHaveBeenCalledWith('0001');
  expect(deleteCommand).toHaveBeenCalledOnce();
});
