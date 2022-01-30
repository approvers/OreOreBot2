import type { Client, Message, PartialMessage } from 'discord.js';
import type {
  MessageEventProvider,
  MessageUpdateEventProvider
} from '../runner';

const execOnlyUserMessage =
  (func: (message: RawMessage) => Promise<void>) =>
  async (message: RawMessage) => {
    if (!message.author?.bot) {
      await func(message);
    }
  };

type RawMessage = Message | PartialMessage;

/**
 * メッセージ `M` に対する抽象的な処理を、`RawMessage` に対する処理へと変換するオブジェクトの抽象。
 *
 * @export
 * @interface Lifter
 * @template M
 */
export interface Lifter<M> {
  lift(
    process: (message: M) => Promise<void>
  ): (message: RawMessage) => Promise<void>;
}

export const lifterFromMap = <M>(map: (message: RawMessage) => M) => ({
  lift: (process: (message: M) => Promise<void>) => (message: RawMessage) =>
    process(map(message))
});

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
    private readonly lifter: Lifter<M>
  ) {}

  onMessageCreate(handler: (message: M) => Promise<void>): void {
    this.client.on(
      'messageCreate',
      execOnlyUserMessage(this.lifter.lift(handler))
    );
  }

  onMessageDelete(handler: (message: M) => Promise<void>): void {
    const wrapper = execOnlyUserMessage(this.lifter.lift(handler));

    this.client.on('messageDelete', wrapper);
    this.client.on('messageDeleteBulk', async (messages) => {
      await Promise.all(messages.map(wrapper));
    });
  }
}

export class MessageUpdateProxy<M> implements MessageUpdateEventProvider<M> {
  constructor(
    private readonly client: Client,
    private readonly map: (message: Message | PartialMessage) => M
  ) {}

  onMessageUpdate(handler: (before: M, after: M) => Promise<void>): void {
    this.client.on('messageUpdate', async (before, after) => {
      if (!after.author?.bot) {
        const beforeMapped = this.map(before);
        const afterMapped = this.map(await after.fetch());
        await handler(beforeMapped, afterMapped);
      }
    });
  }
}
