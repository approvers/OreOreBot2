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

export class RoleCreate implements CommandResponder {
  help: Readonly<HelpInfo> = {
    title: 'ロール作成',
    description: 'ロールを作成するよ',
    commandName: ['rolecreate'],
    argsFormat: [
      {
        name: 'ロール名',
        description: '作成するロールの名前を指定してね'
      },
      {
        name: 'ロールの色',
        description:
          '作成するロールの色を[HEX](https://htmlcolorcodes.com/)で指定してね'
      }
    ]
  };

  constructor(private readonly manager: RoleCreateManager) {}

  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }
    const [command, roleName, roleColor] = message.args;
    if (!this.help.commandName.includes(command)) {
      return;
    }

    if (typeof roleName !== 'string') {
      await message.reply({
        title: 'コマンド形式エラー',
        description: '引数にロール名の文字列を指定してね'
      });
      return;
    }
    if (typeof roleColor !== 'string') {
      await message.reply({
        title: 'コマンド形式エラー',
        description:
          '引数にロールの色の[HEX](https://htmlcolorcodes.com/)を指定してね'
      });
      return;
    }

    if (!roleColor.match(/^#?[0-9a-fA-F]{6}$/m)) {
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
