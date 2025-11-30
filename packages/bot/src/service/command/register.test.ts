import { expect, test, vi } from 'vitest';

import type { Schema } from '../../model/command-schema.js';
import type { Snowflake } from '../../model/id.js';
import { CommandRunner, emptyProxy } from '../../runner/command.js';
import type { CommandResponderFor } from './command-message.js';
import { PingCommand } from './ping.js';
import {
  registerCommands,
  type CommandRepository,
  type Command,
  type RegisteredCommand
} from './register.js';
import { GetVersionCommand } from './version.js';

test('', async () => {
  const setCommands = vi.fn<(commands: Command[]) => Promise<void>>(() =>
    Promise.resolve()
  );
  const updateCommand = vi.fn<(command: RegisteredCommand) => Promise<void>>(
    () => Promise.resolve()
  );
  const deleteCommand = vi.fn<(id: Snowflake) => Promise<void>>(() =>
    Promise.resolve()
  );

  const commandRepo: CommandRepository = {
    currentCommands: () =>
      Promise.resolve([
        {
          id: '0001' as Snowflake,
          description: '',
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
    setCommands,
    updateCommand,
    deleteCommand
  };
  const commandRunner = new CommandRunner(emptyProxy);
  commandRunner.addResponder(
    new GetVersionCommand({
      version: 'v0.1.0'
    }) as unknown as CommandResponderFor<Schema>
  );
  commandRunner.addResponder(
    new PingCommand({
      avgPing: 160
    }) as unknown as CommandResponderFor<Schema>
  );
  await registerCommands({ commandRepo, commandRunner });

  expect(setCommands).toHaveBeenCalledWith([
    {
      description: '現在のレイテンシを表示するよ',
      name: 'ping',
      options: undefined
    },
    {
      description: '現在のレイテンシを表示するよ',
      name: 'latency',
      options: undefined
    }
  ]);
  expect(setCommands).toHaveBeenCalledOnce();
  expect(updateCommand).toHaveBeenCalledWith({
    id: '0002' as Snowflake,
    description: '現在の私のバージョンを出力するよ',
    name: 'version',
    options: undefined
  });
  expect(updateCommand).toHaveBeenCalledOnce();
  expect(deleteCommand).toHaveBeenCalledWith('0001');
  expect(deleteCommand).toHaveBeenCalledOnce();
});
