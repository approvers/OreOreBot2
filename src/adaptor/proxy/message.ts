import type { Client } from 'discord.js';

import type {
  MessageEventProvider,
  MessageUpdateEventProvider
} from '../../runner/index.js';
import type { Middleware, RawMessage } from './middleware.js';

export type MessageHandler<M> = (message: M) => Promise<void>;

/**
 * `Message` を受け渡す場合の `MessageEventProvider` を実装したクラス。
 */
export class MessageProxy<M> implements MessageEventProvider<M> {
  constructor(
    private readonly client: Client,
    private readonly map: Middleware<RawMessage, M>
  ) {}

  onMessageCreate(handler: MessageHandler<M>): void {
    this.client.on('messageCreate', async (m) => {
      try {
        return handler(await this.map(m));
      } catch {
        // 変換処理の結果として続行すべきでないと判断されたため, 無視できます。
      }
    });
  }

  onMessageDelete(handler: MessageHandler<M>): void {
    const wrapper = async (m: RawMessage) => {
      try {
        return handler(await this.map(m));
      } catch {
        // 変換処理の結果として続行すべきでないと判断されたため, 無視できます。
      }
    };

    this.client.on('messageDelete', wrapper);
    this.client.on('messageDeleteBulk', async (messages) => {
      await Promise.all(messages.map(wrapper));
    });
  }
}

export class MessageUpdateProxy<M> implements MessageUpdateEventProvider<M> {
  constructor(
    private readonly client: Client,
    private readonly map: Middleware<[RawMessage, RawMessage], [M, M]>
  ) {}

  onMessageUpdate(handler: (before: M, after: M) => Promise<void>): void {
    const mapped = async (ms: [RawMessage, RawMessage]) => {
      try {
        await handler(...(await this.map(ms)));
        return;
      } catch {
        // 変換処理の結果として続行すべきでないと判断されたため, 無視できます。
      }
    };
    this.client.on('messageUpdate', async (before, after) => {
      await mapped([before, after]);
    });
  }
}
