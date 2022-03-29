import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message';
import type { MessageEvent } from '../runner';

export interface MemberStats {
  allMemberCount(): Promise<number>;
  botMemberCount(): Promise<number>;
}

export class KokuseiChousa implements CommandResponder {
  help: Readonly<HelpInfo> = {
    title: '国勢調査',
    description: '限界開発鯖の人類の数、Botの数とBot率を算出するよ。',
    commandName: [
      'kokusei',
      'kokusei-chousa',
      'population',
      'number',
      'zinnkou',
      'zinkou'
    ],
    argsFormat: []
  };

  constructor(private readonly stats: MemberStats) {}

  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (
      event !== 'CREATE' ||
      !this.help.commandName.includes(message.args[0])
    ) {
      return;
    }

    const botMemberCount = await this.stats.botMemberCount();
    const allMemberCount = await this.stats.allMemberCount();
    const peopleCount = allMemberCount - botMemberCount;
    const botRate = (botMemberCount / allMemberCount) * 100;

    await message.reply({
      title: '***†只今の限界開発鯖の人口†***',
      fields: [
        {
          name: '人類の数',
          value: `${allMemberCount}人`,
          inline: true
        },
        {
          name: '人間の数',
          value: `${peopleCount}人`,
          inline: true
        },
        { name: 'Bot数', value: `${botMemberCount}人`, inline: true },
        { name: 'Bot率', value: botRate.toFixed(3) + '%' }
      ]
    });
  }
}
