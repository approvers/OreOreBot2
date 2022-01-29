export type MessageEvent = 'CREATE' | 'UPDATE' | 'DELETE';

/**
 * `MessageResponseRunner` に登録する機能が実装するインターフェイス。`M` には discord.js の `Message` などが入る。
 *
 * @export
 * @interface MessageEventResponder
 * @template M
 */
export interface MessageEventResponder<M> {
  on(event: MessageEvent, message: M): Promise<void>;
}

export const composeMessageEventResponders = <M>(
  ...responders: readonly MessageEventResponder<M>[]
): MessageEventResponder<M> => ({
  async on(event, message) {
    await Promise.all(
      responders.map((responder) => responder.on(event, message))
    );
  }
});

/**
 * `MessageResponseRunner` のためにメッセージに関するイベントハンドラの登録手段を提供する。
 *
 * @export
 * @interface MessageEventProvider
 * @template M
 */
export interface MessageEventProvider<M> {
  onMessageCreate(handler: (message: M) => Promise<void>): void;
  onMessageUpdate(handler: (message: M) => Promise<void>): void;
  onMessageDelete(handler: (message: M) => Promise<void>): void;
}

/**
 * メッセージに反応するタイプの機能を登録すると、`MessageEventProvider` からのイベントを `MessageEvent` 付きの形式に変換し、それに渡して実行する。
 *
 * @export
 * @class MessageResponseRunner
 * @template M
 */
export class MessageResponseRunner<M> {
  constructor(provider: MessageEventProvider<M>) {
    provider.onMessageCreate((message) => this.triggerEvent('CREATE', message));
    provider.onMessageDelete((message) => this.triggerEvent('DELETE', message));
    provider.onMessageUpdate((message) => this.triggerEvent('UPDATE', message));
  }

  private async triggerEvent(event: MessageEvent, message: M): Promise<void> {
    await Promise.all(this.responders.map((res) => res.on(event, message)));
  }

  private responders: MessageEventResponder<M>[] = [];

  addResponder(responder: MessageEventResponder<M>) {
    this.responders.push(responder);
  }
}
