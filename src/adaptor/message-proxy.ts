import { Client, Message, PartialMessage } from 'discord.js';
import { ObservableMessage } from '.';
import { MessageEventProvider } from '../runner';

const compose =
  <A, B, C>(g: (b: B) => C, f: (a: A) => B): ((a: A) => C) =>
  (a) =>
    g(f(a));

export const mapToObservableProxy = (message: Message): ObservableMessage =>
  new ObservableMessage(message);

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
    private readonly map: (message: Message) => M
  ) {}

  onMessageCreate(handler: (message: M) => Promise<void>): void {
    this.client.on('messageCreate', compose(handler, this.map));
  }

  onMessageUpdate(handler: (message: M) => Promise<void>): void {
    this.client.on('messageUpdate', async (message) =>
      compose(handler, this.map)(await message.fetch())
    );
  }

  onMessageDelete(handler: (message: M) => Promise<void>): void {
    const wrapper = async (message: Message | PartialMessage) =>
      compose(handler, this.map)(await message.fetch());

    this.client.on('messageDelete', wrapper);
    this.client.on('messageDeleteBulk', async (messages) => {
      await Promise.all(messages.map(wrapper));
    });
  }
}
