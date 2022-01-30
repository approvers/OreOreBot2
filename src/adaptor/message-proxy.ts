import type { Client, Message, PartialMessage } from 'discord.js';
import type {
  MessageEventProvider,
  MessageUpdateEventProvider
} from '../runner';

const compose =
  <A, B, C>(g: (b: B) => C, f: (a: A) => B): ((a: A) => C) =>
  (a) =>
    g(f(a));

const execOnlyUserMessage =
  (func: (message: Message | PartialMessage) => Promise<void>) =>
  async (message: Message | PartialMessage) => {
    if (!message.author?.bot) {
      await func(message);
    }
  };

/**
 * `Message` を受け渡す場合の `MessageEventProvider` を実装したクラス。
 *
 * @export
 * @class MessageProxy
 * @implements {MessageEventProvider<Message>}
 */
export class MessageProxy<M>
  implements MessageEventProvider<M>, MessageUpdateEventProvider<M>
{
  constructor(
    private readonly client: Client,
    private readonly map: (message: Message | PartialMessage) => M
  ) {}

  onMessageCreate(handler: (message: M) => Promise<void>): void {
    this.client.on(
      'messageCreate',
      execOnlyUserMessage(compose(handler, this.map))
    );
  }

  onMessageUpdate(handler: (before: M, after: M) => Promise<void>): void {
    this.client.on('messageUpdate', async (before, after) => {
      if (!after.author?.bot) {
        const beforeMapped = this.map(before);
        const afterMapped = this.map(await after.fetch());
        await handler(beforeMapped, afterMapped);
      }
    });
  }

  onMessageDelete(handler: (message: M) => Promise<void>): void {
    const wrapper = execOnlyUserMessage(compose(handler, this.map));

    this.client.on('messageDelete', wrapper);
    this.client.on('messageDeleteBulk', async (messages) => {
      await Promise.all(messages.map(wrapper));
    });
  }
}
