import type { Client } from 'discord.js';
import type { Ping } from '../../service/ping.js';

export class DiscordWS implements Ping {
  constructor(private readonly client: Client) {}

  get avgPing(): number {
    return this.client.ws.ping;
  }
}
