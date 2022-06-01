import { Client } from 'discord.js';
import { Ping } from '../service/ping';

export class DiscordWS implements Ping {
  constructor(private readonly client: Client) {}

  get avgPing(): number {
    return this.client.ws.ping;
  }
}
