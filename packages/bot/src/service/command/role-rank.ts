import type { DepRegistry } from '../../driver/dep-registry.js';
import { membersRepositoryKey } from '../../model/member.js';
import type { HelpInfo } from '../../runner/command.js';
import type { CommandMessage, CommandResponderFor } from './command-message.js';

const SCHEMA = {
  names: ['rolerank'],
  description: 'メンバーごとのロール数をランキングにするよ',
  subCommands: {}
} as const;

export class RoleRank implements CommandResponderFor<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'ロール数ランキング',
    description: '各メンバーごとのロール数をランキング形式で表示するよ',
    pageName: 'role-rank'
  };
  readonly schema = SCHEMA;

  constructor(private readonly reg: DepRegistry) {}

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const members = await this.reg
      .get(membersRepositoryKey)
      .fetchMembersWithRole();
    members.sort((a, b) => b.roles - a.roles);
    members.splice(5);
    const fields = members.map(({ displayName, roles }, index) => ({
      name: `${index + 1} 位`,
      value: `${displayName} : ${roles} 個`
    }));

    await message.reply({
      title: this.help.title,
      fields
    });
  }
}
