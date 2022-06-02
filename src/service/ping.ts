import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message';
import type { MessageEvent } from '../runner';

export interface Ping {
  /**
   * WebSocketのping値
   */
  avgPing: number;
}

export class PingCommand implements CommandResponder {
  help: Readonly<HelpInfo> = {
    title: 'Ping',
    description: '現在のレイテンシを表示するよ。',
    commandName: ['ping', 'latency'],
    argsFormat: []
  };

  constructor(private readonly ping: Ping) {}

  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (
      event !== 'CREATE' ||
      !this.help.commandName.includes(message.args[0])
    ) {
      return;
    }

    await message.reply({
      title: 'Ping',
      description: '🏓 Pongだよ。',
      color: 0x7ec4ed,
      fields: [
        {
          name: 'Latency(WebSocket)',
          value: `${this.ping.avgPing}ms`,
          inline: true
        },
        {
          name: 'Latency(API)',
          value: `${
            Date.now() - message.timestamp
          }ms\n[Discord Status](https://discordstatus.com/)`,
          inline: true
        }
      ]
    });
  }
}
