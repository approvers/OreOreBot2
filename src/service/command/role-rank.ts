import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';

export interface MemberWithRole {
  displayName: string;
  roles: number;
}

export interface MembersWithRoleRepository {
  fetchMembersWithRole(): Promise<MemberWithRole[]>;
}

const SCHEMA = {
  names: ['rolerank'],
  subCommands: {}
} as const;

export class RoleRank implements CommandResponder<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'ロール数ランキング',
    description: '各メンバーごとのロール数をランキング形式で表示するよ',
    docId: 'role-rank'
  };
  readonly schema = SCHEMA;

  constructor(private readonly repo: MembersWithRoleRepository) {}

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
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
