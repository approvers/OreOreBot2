export type ScheduledEvent = 'CREATE' | 'DELETE' | 'UPDATE' | 'INTERESTED';

export interface ScheduledEventResponder<R> {
  on(event: ScheduledEvent, scheduledEvent: R): Promise<void>;
}

export const composeScheduledEventResponders = <R>(
  ...responders: readonly ScheduledEventResponder<R>[]
): ScheduledEventResponder<R> => ({
  async on(event, scheduledEvent) {
    await Promise.all(
      responders.map((responder) => responder.on(event, scheduledEvent))
    );
  }
});

export class ScheduledEventResponderRunner<R> {
  async triggerEvent(event: ScheduledEvent, scheduledEvent: R): Promise<void> {
    try {
      await Promise.all(
        this.responder.map((res) => res.on(event, scheduledEvent))
      );
    } catch (e) {
      console.error(e);
    }
  }

  private responder: ScheduledEventResponder<R>[] = [];

  addResponder(responder: ScheduledEventResponder<R>) {
    this.responder.push(responder);
  }
}
