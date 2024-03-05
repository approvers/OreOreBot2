import { expect, test, mock } from 'bun:test';

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
  const createCommand = mock<(_: Command) => Promise<void>>(() =>
    Promise.resolve()
  );
  const updateCommand = mock<(_: RegisteredCommand) => Promise<void>>(() =>
    Promise.resolve()
  );
  const deleteCommand = mock<(_: Snowflake) => Promise<void>>(() =>
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

  const reg = new DepRegistry();
  reg.add(versionFetcherKey, { version: 'v0.1.0' });
  reg.add(pingKey, {
    avgPing: 160
  });
  const commandRunner = new CommandRunner(emptyProxy);
  commandRunner.addResponder(new GetVersionCommand(reg));
  commandRunner.addResponder(new PingCommand(reg));

  await registerCommands({ commandRepo, commandRunner });

  expect(createCommand).toHaveBeenCalledWith({
    description: '現在のレイテンシを表示するよ',
    name: 'ping',
    options: undefined
  });
  expect(createCommand).toHaveBeenCalledWith({
    description: '現在のレイテンシを表示するよ',
    name: 'latency',
    options: undefined
  });
  expect(createCommand).toHaveBeenCalledTimes(2);
  expect(updateCommand).toHaveBeenCalledWith({
    id: '0002' as Snowflake,
    description: '現在の私のバージョンを出力するよ',
    name: 'version',
    options: undefined
  });
  expect(updateCommand).toHaveBeenCalledTimes(1);
  expect(deleteCommand).toHaveBeenCalledWith('0001');
  expect(deleteCommand).toHaveBeenCalledTimes(1);
});
