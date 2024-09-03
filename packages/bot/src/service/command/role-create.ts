import type { DepRegistry } from '../../driver/dep-registry.js';
import { roleRepositoryKey } from '../../model/role.js';
import type { HelpInfo } from '../../runner/command.js';
import type { CommandMessage, CommandResponderFor } from './command-message.js';

const HEX_FORMAT = /^#?[0-9a-fA-F]{6}$/m;

const SCHEMA = {
  names: ['rolecreate'],
  description: 'ロールを作成するよ',
  subCommands: {},
  params: [
    {
      type: 'STRING',
      name: 'name',
      description: '作成するロールの名前を指定してね'
    },
    {
      type: 'STRING',
      name: 'color',
      description:
        '作成するロールの色を[HEX](https://htmlcolorcodes.com/)で指定してね'
    }
  ]
} as const;

export class RoleCreate implements CommandResponderFor<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'ロール作成',
    description: 'ロールを作成するよ',
    pageName: 'role-create'
  };
  readonly schema = SCHEMA;

  constructor(private readonly reg: DepRegistry) {}

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const [roleName, roleColor] = message.args.params;
    if (!HEX_FORMAT.exec(roleColor)) {
      await message.reply({
        title: 'コマンド形式エラー',
        description:
          '引数のHEXが6桁の16進数でないよ。HEXは`000000`から`FFFFFF`までの6桁の16進数だよ'
      });
      return;
    }
    const roleColorRemoveSharp = roleColor.replace('#', '');

    await this.reg
      .get(roleRepositoryKey)
      .createRole(roleName, roleColorRemoveSharp, message.senderName);
    await message.reply({
      title: 'ロール作成',
      description: 'ロールを作成したよ'
    });
  }
}
