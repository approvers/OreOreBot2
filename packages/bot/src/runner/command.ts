import type { Dep0 } from '../driver/dep-registry.js';
import type { Schema } from '../model/command-schema.js';

export type MessageCreateListener<M> = (message: M) => Promise<void>;

export interface CommandProxy<M> {
  addMessageCreateListener(schema: Schema, listener: M): void;
}

export const emptyProxy: CommandProxy<unknown> = {
  addMessageCreateListener: () => {
    // do nothing
  }
};

export interface HelpInfo {
  title: string;
  description: string;
  /**
   * はらちょドキュメントサイト(haracho.approvers.dev):
   * 各コマンドリファレンスのページ名を指定する。
   * 例: !ping コマンドのリファレンスが `haracho.approvers.dev/commands/ping` にある場合は `ping` を docId に指定する。
   */
  pageName: string;
}

export interface CommandResponder<S extends Schema, M> {
  help: Readonly<HelpInfo>;
  schema: Readonly<S>;
  on(message: M): Promise<void>;
}

export class CommandRunner {
  private readonly responders: CommandResponder<Schema, unknown>[] = [];

  constructor(private readonly proxy: CommandProxy<unknown>) {}

  addResponder<S extends Schema, M>(responder: CommandResponder<S, M>) {
    this.responders.push(responder);
    this.proxy.addMessageCreateListener(responder.schema, (message: unknown) =>
      responder.on(message as M)
    );
  }

  getResponders(): readonly CommandResponder<Schema, unknown>[] {
    return this.responders;
  }
}
export interface CommandRunnerDep extends Dep0 {
  type: CommandRunner;
}
export const commandRunnerKey = Symbol(
  'COMMAND_RUNNER'
) as unknown as CommandRunnerDep;
