import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';

import type { MessageEvent } from '../../runner/index.js';

export interface Ping {
  /**
   * WebSocketのping値
   */
  avgPing: number;
}

const SCHEMA = {
  names: ['ping', 'latency'],
  subCommands: {}
} as const;

export class PingCommand implements CommandResponder<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'Ping',
    description: '現在のレイテンシを表示するよ。'
  };
  readonly schema = SCHEMA;

  constructor(private readonly ping: Ping) {}

  async on(
    event: MessageEvent,
    message: CommandMessage<typeof SCHEMA>
  ): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }

    await message.reply({
      title: 'Ping',
      url: 'https://discordstatus.com/',
      description: `🏓 Pongだよ。 / **${this.ping.avgPing}**ms`,
      color: 0x7ec4ed
    });
  }
}
