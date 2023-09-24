import equal from 'deep-equal';

import type { Snowflake } from '../../model/id.js';
import type { CommandRunner } from '../../runner/command.js';
import { schemaToDiscordFormat } from './register/command-schema.js';

export interface Command {
  name: string;
  [key: string]: unknown;
}

export interface RegisteredCommand extends Command {
  id: Snowflake;
}

export interface CommandRepository {
  currentCommands(): Promise<RegisteredCommand[]>;
  createCommand(command: Command): Promise<void>;
  updateCommand(command: RegisteredCommand): Promise<void>;
  deleteCommand(id: Snowflake): Promise<void>;
}

export interface RegisterCommandOptions {
  readonly commandRepo: CommandRepository;
  readonly commandRunner: CommandRunner;
}

export const registerCommands = async ({
  commandRepo,
  commandRunner
}: RegisterCommandOptions): Promise<void> => {
  const currentRegistered = await commandRepo.currentCommands();
  const currentRegisteredByName = new Map(
    currentRegistered.map((obj) => [obj.name, obj])
  );
  const commands = commandRunner
    .getResponders()
    .flatMap((responder) => schemaToDiscordFormat(responder.schema));
  const commandNames = new Map(commands.map((obj) => [obj.name, obj]));

  const idsNeedToDelete = [...currentRegisteredByName.keys()]
    .filter((name) => !commandNames.has(name))
    .map(
      (name) =>
        (currentRegisteredByName.get(name)?.id ?? 'unknown') as Snowflake
    );
  const needToUpdate = [...currentRegisteredByName.values()].filter(
    (registered) => equal(commandNames.get(registered.name) ?? {}, registered)
  );
  const needToRegister = commands.filter(
    ({ name }) => !currentRegisteredByName.has(name)
  );

  if (0 < idsNeedToDelete.length) {
    console.log('コマンドの削除を開始…');
    for (let i = 0; i < idsNeedToDelete.length; ++i) {
      console.log(`${i + 1}/${idsNeedToDelete.length}`);
      await commandRepo.deleteCommand(idsNeedToDelete[i]);
    }
  }

  if (0 < needToUpdate.length) {
    console.log('コマンドの更新を開始…');
    for (let i = 0; i < needToUpdate.length; ++i) {
      console.log(`${i + 1}/${needToUpdate.length}`);
      await commandRepo.updateCommand(needToUpdate[i]);
    }
  }

  if (0 < needToRegister.length) {
    console.log('コマンドの追加を開始…');
    for (let i = 0; i < needToRegister.length; ++i) {
      console.log(`${i + 1}/${needToRegister.length}`);
      await commandRepo.createCommand(needToRegister[i]);
    }
  }
  console.log('コマンドの登録に成功しました。');
};
