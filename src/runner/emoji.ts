export type EmojiEvent = 'CREATE' | 'DELETE';

export interface EmojiEventResponder<E> {
  on(event: EmojiEvent, emoji: E): Promise<void>;
}

export const composeEmojiEventResponders = <E>(
  ...responders: readonly EmojiEventResponder<E>[]
): EmojiEventResponder<E> => ({
  async on(event, emoji) {
    await Promise.all(
      responders.map((responder) => responder.on(event, emoji))
    );
  }
});

export interface EmojiEventProvider<E> {
  onEmojiCreate(handler: (emoji: E) => Promise<void>): void;
  onEmojiDelete(handler: (emoji: E) => Promise<void>): void;
}

export class EmojiResponseRunner<
  E,
  R extends EmojiEventResponder<E> = EmojiEventResponder<E>
> {
  constructor(provider: EmojiEventProvider<E>) {
    provider.onEmojiCreate((emoji) => this.triggerEvent('CREATE', emoji));
    provider.onEmojiDelete((emoji) => this.triggerEvent('DELETE', emoji));
  }

  private async triggerEvent(event: EmojiEvent, emoji: E): Promise<void> {
    try {
      await Promise.all(this.responders.map((res) => res.on(event, emoji)));
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

export interface EmojiUpdateEventResponder<E> {
  on(event: 'UPDATE', before: E, after: E): Promise<void>;
}

export const composeEmojiUpdateEventResponders = <E>(
  ...responders: readonly EmojiUpdateEventResponder<E>[]
): EmojiUpdateEventResponder<E> => ({
  async on(event, before, after) {
    await Promise.all(
      responders.map((responder) => responder.on(event, before, after))
    );
  }
});

export interface EmojiUpdateEventProvider<E> {
  onEmojiUpdate(handler: (before: E, after: E) => Promise<void>): void;
}

export class EmojiUpdateResponseRunner<E> {
  constructor(provider: EmojiUpdateEventProvider<E>) {
    provider.onEmojiUpdate((...args) => this.triggerEvent(args));
  }

  private async triggerEvent([before, after]: [E, E]): Promise<void> {
    try {
      await Promise.all(
        this.responders.map((res) => res.on('UPDATE', before, after))
      );
    } catch (e) {
      console.error(e);
    }
  }

  private responders: EmojiUpdateEventResponder<E>[] = [];

  addResponder(responder: EmojiUpdateEventResponder<E>) {
    this.responders.push(responder);
  }
}
