import { expect, test, vi } from 'vitest';

import { DepRegistry } from '../../driver/dep-registry.js';
import type { Snowflake } from '../../model/id.js';
import { CommandRunner, emptyProxy } from '../../runner/command.js';
import { PingCommand, pingKey } from './ping.js';
import {
  registerCommands,
  type CommandRepository,
  type Command,
  type RegisteredCommand
} from './register.js';
import { GetVersionCommand, versionFetcherKey } from './version.js';

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
  const registry = new DepRegistry();
  registry.add(versionFetcherKey, { version: 'v0.1.0' });
  registry.add(pingKey, { avgPing: 160 });
  commandRunner.addResponder(new GetVersionCommand(registry));
  commandRunner.addResponder(new PingCommand(registry));
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
