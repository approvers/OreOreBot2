import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';
import { MessageEvent } from '../runner/message.js';

export interface MemberWithRole {
  displayName: string;
  roles: number;
}

export interface MembersWithRoleRepository {
  fetchMembersWithRole(): Promise<MemberWithRole[]>;
}

export class RoleRank implements CommandResponder {
  help: Readonly<HelpInfo> = {
    title: 'ロール数ランキング',
    commandName: ['rolerank'],
    argsFormat: [],
    description: '各メンバーごとのロール数をランキング形式で表示するよ'
  };

  constructor(private readonly repo: MembersWithRoleRepository) {}

  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }
    if (!this.help.commandName.includes(message.args[0])) {
      return;
    }
    const members = await this.repo.fetchMembersWithRole();
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
