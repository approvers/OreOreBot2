import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';
import type { MessageEvent } from '../../runner/message.js';

export type RoleIcon =
  | {
      isUnicode: true;
      emoji: string;
    }
  | {
      isUnicode: false;
      hash: string;
    };

export interface RoleStats {
  color: string;
  createdAt: number;
  icon?: RoleIcon;
  numOfMembersBelonged: number;
  position: number;
}

export interface RoleStatsRepository {
  fetchStats(roleId: string): Promise<RoleStats | null>;
}

export class RoleInfo implements CommandResponder {
  help: Readonly<HelpInfo> = {
    title: 'ロール秘書艦',
    description: '指定したロールの情報を調べてくるよ',
    commandName: ['roleinfo'],
    argsFormat: [
      {
        name: 'ロールID',
        description: 'このIDのロールを調べるよ'
      }
    ]
  };

  constructor(private readonly repo: RoleStatsRepository) {}

  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }
    const [command, roleId] = message.args;
    if (!this.help.commandName.includes(command)) {
      return;
    }
    if (typeof roleId !== 'string') {
      await message.reply({
        title: 'コマンド形式エラー',
        description: '引数にロールIDの文字列を指定してね'
      });
      return;
    }

    const stats = await this.repo.fetchStats(roleId);
    if (!stats) {
      await message.reply({
        title: '引数エラー',
        description: '指定のIDのロールが見つからないみたい……'
      });
      return;
    }

    await message.reply(this.buildEmbed(stats, roleId));
  }

  private buildEmbed(
    { color, createdAt, icon, numOfMembersBelonged, position }: RoleStats,
    roleId: string
  ) {
    const fields = [
      {
        name: 'ID',
        value: `${roleId}`,
        inline: true
      },
      {
        name: '作成日時',
        value: `<t:${createdAt}>`,
        inline: true
      },
      {
        name: '所属人数',
        value: `${numOfMembersBelonged}人`,
        inline: true
      },
      {
        name: 'ポジション',
        value: `${position}番目`,
        inline: true
      },
      {
        name: 'カラーコード',
        value: color,
        inline: true
      }
    ];
    if (icon && icon.isUnicode) {
      fields.push({
        name: 'アイコン',
        value: icon.emoji,
        inline: true
      });
    }

    const thumbnail =
      icon && !icon.isUnicode
        ? {
            url: `https://cdn.discordapp.com/role-icons/${roleId}/${icon.hash}.png?size=64`
          }
        : undefined;
    const embed = {
      title: `ロールの情報`,
      description: `司令官、頼まれていた <@&${roleId}> の情報だよ`,
      fields,
      thumbnail
    };
    return embed;
  }
}
