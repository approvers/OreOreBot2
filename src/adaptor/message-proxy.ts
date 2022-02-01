import type { Client } from 'discord.js';
import { Lifter, RawMessage } from './lifter';
import type {
  MessageEventProvider,
  MessageUpdateEventProvider
} from '../runner';

export type MessageHandler<M> = (message: M) => Promise<void>;

/**
 * `Message` を受け渡す場合の `MessageEventProvider` を実装したクラス。
 *
 * @export
 * @class MessageProxy
 * @implements {MessageEventProvider<Message>}
 */
export class MessageProxy<M> implements MessageEventProvider<M> {
  constructor(
    private readonly client: Client,
    private readonly lifter: Lifter<M, RawMessage>
  ) {}

  onMessageCreate(handler: MessageHandler<M>): void {
    this.client.on('messageCreate', this.lifter(handler));
  }

  onMessageDelete(handler: MessageHandler<M>): void {
    const wrapper = this.lifter(handler);

    this.client.on('messageDelete', wrapper);
    this.client.on('messageDeleteBulk', async (messages) => {
      await Promise.all(messages.map(wrapper));
    });
  }
}

export class MessageUpdateProxy<M> implements MessageUpdateEventProvider<M> {
  constructor(
    private readonly client: Client,
    private readonly lifter: Lifter<[M, M], [RawMessage, RawMessage]>
  ) {}

  onMessageUpdate(handler: (before: M, after: M) => Promise<void>): void {
    const mapped = this.lifter((args) => handler(...args));
    this.client.on('messageUpdate', (before, after) => mapped([before, after]));
  }
}
