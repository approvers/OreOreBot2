import type { HelpInfo } from '../../runner/command.js';
import type { CommandMessage, CommandResponderFor } from './command-message.js';

export interface Ping {
  /**
   * WebSocketのping値
   */
  avgPing: number;
}

const SCHEMA = {
  names: ['ping', 'latency'],
  description: '現在のレイテンシを表示するよ',
  subCommands: {}
} as const;

export class PingCommand implements CommandResponderFor<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'Ping',
    description: '現在のレイテンシを表示するよ。',
    pageName: 'ping'
  };
  readonly schema = SCHEMA;

  constructor(private readonly ping: Ping) {}

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    await message.reply({
      title: 'Ping',
      url: 'https://discordstatus.com/',
      description: `🏓 Pongだよ。 / **${this.ping.avgPing}**ms`
    });
  }
}
