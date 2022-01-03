import { Client, Message, PartialMessage } from 'discord.js'
import { MessageEventProvider } from '../runner'

export class MessageProxy implements MessageEventProvider<Message> {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly client: Client) {}

  onMessageCreate(handler: (message: Message) => Promise<void>): void {
    this.client.on('messageCreate', handler)
  }

  onMessageUpdate(handler: (message: Message) => Promise<void>): void {
    this.client.on('messageUpdate', async (message) => {
      handler(await message.fetch())
    })
  }

  onMessageDelete(handler: (message: Message) => Promise<void>): void {
    const wrapper = async (message: Message | PartialMessage) => {
      handler(await message.fetch())
    }
    this.client.on('messageDelete', wrapper)
    this.client.on('messageDeleteBulk', async (messages) => {
      await Promise.all(messages.map(wrapper))
    })
  }
}
