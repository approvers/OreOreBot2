import { Client, Message } from 'discord.js'

export type MessageEvent = 'CREATE' | 'UPDATE' | 'DELETE'

export interface Responder {
  on(event: MessageEvent, message: Message): Promise<void>
}

export class MessageResponseRunner {
  constructor(client: Client) {
    client.on('messageCreate', (message) =>
      this.triggerEvent('CREATE', message)
    )
    client.on('messageDelete', async (message) =>
      this.triggerEvent('DELETE', await message.fetch())
    )
    client.on('messageDeleteBulk', async (messages) => {
      await Promise.all(
        messages.map(async (message) =>
          this.triggerEvent('DELETE', await message.fetch())
        )
      )
    })
    client.on('messageUpdate', async (message) =>
      this.triggerEvent('UPDATE', await message.fetch())
    )
  }

  private async triggerEvent(
    event: MessageEvent,
    message: Message
  ): Promise<void> {
    await Promise.all(this.responders.map((res) => res.on(event, message)))
  }

  private responders: Responder[] = []

  addResponder(responder: Responder) {
    this.responders.push(responder)
  }
}
