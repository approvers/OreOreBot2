export type MessageEvent = 'CREATE' | 'DELETE';

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
  onMessageDelete(handler: (message: M) => Promise<void>): void;
}

/**
 * メッセージに反応するタイプの機能を登録すると、`MessageEventProvider` からのイベントを `MessageEvent` 付きの形式に変換し、それに渡して実行する。
 *
 * @export
 * @class MessageResponseRunner
 * @template M
 */
export class MessageResponseRunner<
  M,
  R extends MessageEventResponder<M> = MessageEventResponder<M>
> {
  constructor(provider: MessageEventProvider<M>) {
    provider.onMessageCreate((message) => this.triggerEvent('CREATE', message));
    provider.onMessageDelete((message) => this.triggerEvent('DELETE', message));
  }

  private async triggerEvent(event: MessageEvent, message: M): Promise<void> {
    try {
      await Promise.all(this.responders.map((res) => res.on(event, message)));
    } catch (e) {
      console.error(e);
    }
  }

  private responders: R[] = [];

  addResponder(responder: R) {
    this.responders.push(responder);
  }

  getResponders(): readonly R[] {
    return this.responders;
  }
}

/**
 * `MessageResponseRunner` に登録する機能が実装するインターフェイス。`M` には discord.js の `Message` などが入る。
 *
 * @export
 * @interface MessageEventResponder
 * @template M
 */
export interface MessageUpdateEventResponder<M> {
  on(event: 'UPDATE', before: M, after: M): Promise<void>;
}

export const composeMessageUpdateEventResponders = <M>(
  ...responders: readonly MessageUpdateEventResponder<M>[]
): MessageUpdateEventResponder<M> => ({
  async on(event, before, after) {
    await Promise.all(
      responders.map((responder) => responder.on(event, before, after))
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
export interface MessageUpdateEventProvider<M> {
  onMessageUpdate(handler: (before: M, after: M) => Promise<void>): void;
}

/**
 * メッセージに反応するタイプの機能を登録すると、`MessageEventProvider` からのイベントを `MessageEvent` 付きの形式に変換し、それに渡して実行する。
 *
 * @export
 * @class MessageResponseRunner
 * @template M
 */
export class MessageUpdateResponseRunner<M> {
  constructor(provider: MessageUpdateEventProvider<M>) {
    provider.onMessageUpdate((...args) => this.triggerEvent(args));
  }

  private async triggerEvent([before, after]: [M, M]): Promise<void> {
    try {
      await Promise.all(
        this.responders.map((res) => res.on('UPDATE', before, after))
      );
    } catch (e) {
      console.error(e);
    }
  }

  private responders: MessageUpdateEventResponder<M>[] = [];

  addResponder(responder: MessageUpdateEventResponder<M>) {
    this.responders.push(responder);
  }
}
