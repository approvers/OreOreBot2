import type {
  CommandMessage,
  CommandResponder
} from '../service/command/command-message.js';

import type { Schema } from '../model/command-schema.js';

export type MessageCreateListener = (
  message: CommandMessage<Schema>
) => Promise<void>;

export interface CommandProxy {
  addMessageCreateListener(
    schema: Schema,
    listener: MessageCreateListener
  ): void;
}

export class CommandRunner {
  private readonly responders: CommandResponder<Schema>[] = [];

  constructor(private readonly proxy: CommandProxy) {}

  addResponder(responder: CommandResponder<Schema>) {
    this.responders.push(responder);
    this.proxy.addMessageCreateListener(responder.schema, (message) =>
      responder.on(message)
    );
  }

  getResponders(): readonly CommandResponder<Schema>[] {
    return this.responders;
  }
}
