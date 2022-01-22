import { Message } from 'discord.js';
import { Observable } from '../service/mitetazo';

export class ObservableMessage implements Observable {
  constructor(private readonly message: Message) {}

  get author(): string {
    return this.message.author.username;
  }
  get content(): string {
    return this.message.content;
  }

  async sendToSameChannel(message: string): Promise<void> {
    await this.message.channel.send(message);
  }
}
