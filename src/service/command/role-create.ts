import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';

import type { MessageEvent } from '../../runner/message.js';

export interface RoleCreateManager {
  createRole(
    roleName: string,
    roleColor: string,
    createSenderName: string
  ): Promise<void>;
}

const HEX_FORMAT = /^#?[0-9a-fA-F]{6}$/m;

const SCHEMA = {
  names: ['rolecreate'],
  subCommands: {},
  params: [
    {
      type: 'STRING',
      name: 'ロール名',
      description: '作成するロールの名前を指定してね'
    },
    {
      type: 'STRING',
      name: 'ロールの色',
      description:
        '作成するロールの色を[HEX](https://htmlcolorcodes.com/)で指定してね'
    }
  ]
} as const;

export class RoleCreate implements CommandResponder<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'ロール作成',
    description: 'ロールを作成するよ'
  };
  readonly schema = SCHEMA;

  constructor(private readonly manager: RoleCreateManager) {}

  async on(
    event: MessageEvent,
    message: CommandMessage<typeof SCHEMA>
  ): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }

    const [roleName, roleColor] = message.args.params;
    if (!roleColor.match(HEX_FORMAT)) {
      await message.reply({
        title: 'コマンド形式エラー',
        description:
          '引数のHEXが6桁の16進数でないよ。HEXは`000000`から`FFFFFF`までの6桁の16進数だよ'
      });
      return;
    }
    const roleColorRemoveSharp = roleColor.replace('#', '');

    await this.manager.createRole(
      roleName,
      roleColorRemoveSharp,
      message.senderName
    );
    await message.reply({
      title: 'ロール作成',
      description: 'ロールを作成したよ'
    });
  }
}
