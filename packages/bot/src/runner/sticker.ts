export type StickerEvent = 'CREATE' | 'UPDATE' | 'DELETE';

export interface StickerEventResponder<S> {
  on(event: StickerEvent, sticker: S): Promise<void>;
}

export const composeStickerEventResponders = <S>(
  ...responders: readonly StickerEventResponder<S>[]
): StickerEventResponder<S> => ({
  async on(event, sticker) {
    await Promise.all(
      responders.map((responder) => responder.on(event, sticker))
    );
  }
});

export interface StickerEventProvider<S> {
  onStickerCreate(handler: (sticker: S) => Promise<void>): void;
}

export class StickerResponseRunner<
  S,
  R extends StickerEventResponder<S> = StickerEventResponder<S>
> {
  constructor(provider: StickerEventProvider<S>) {
    provider.onStickerCreate((sticker) => this.triggerEvent('CREATE', sticker));
  }

  private async triggerEvent(event: StickerEvent, sticker: S): Promise<void> {
    try {
      await Promise.all(this.responders.map((res) => res.on(event, sticker)));
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
