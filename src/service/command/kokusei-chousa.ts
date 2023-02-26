import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';

export interface MemberStats {
  allMemberCount(): Promise<number>;
  botMemberCount(): Promise<number>;
}

const SCHEMA = {
  names: [
    'kokusei',
    'kokusei-chousa',
    'population',
    'number',
    'zinnkou',
    'zinkou'
  ],
  subCommands: {}
} as const;

export class KokuseiChousa implements CommandResponder<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: '国勢調査',
    description: '限界開発鯖の人類の数、Botの数とBot率を算出するよ。',
    pageName: 'kokusei'
  };
  readonly schema = SCHEMA;

  constructor(private readonly stats: MemberStats) {}

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const botMemberCount = await this.stats.botMemberCount();
    const allMemberCount = await this.stats.allMemberCount();
    const peopleCount = allMemberCount - botMemberCount;
    const botRate = (botMemberCount / allMemberCount) * 100;

    await message.reply({
      title: '***†只今の限界開発鯖の人口†***',
      fields: [
        {
          name: '人間+Bot',
          value: `${allMemberCount}人`,
          inline: true
        },
        {
          name: '人類の数',
          value: `${peopleCount}人`,
          inline: true
        },
        { name: 'Botの数', value: `${botMemberCount}人`, inline: true },
        { name: 'Bot率', value: botRate.toFixed(3) + '%' }
      ]
    });
  }
}
