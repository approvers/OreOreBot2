export type MessageEvent = 'CREATE' | 'UPDATE' | 'DELETE'

export interface Responder<M> {
  on(event: MessageEvent, message: M): Promise<void>
}

export interface MessageEventProvider<M> {
  onMessageCreate(handler: (message: M) => Promise<void>): void
  onMessageUpdate(handler: (message: M) => Promise<void>): void
  onMessageDelete(handler: (message: M) => Promise<void>): void
}

export class MessageResponseRunner<M> {
  constructor(provider: MessageEventProvider<M>) {
    provider.onMessageCreate((message) => this.triggerEvent('CREATE', message))
    provider.onMessageDelete(async (message) =>
      this.triggerEvent('DELETE', message)
    )
    provider.onMessageUpdate(async (message) =>
      this.triggerEvent('UPDATE', message)
    )
  }

  private async triggerEvent(event: MessageEvent, message: M): Promise<void> {
    await Promise.all(this.responders.map((res) => res.on(event, message)))
  }

  private responders: Responder<M>[] = []

  addResponder(responder: Responder<M>) {
    this.responders.push(responder)
  }
}
