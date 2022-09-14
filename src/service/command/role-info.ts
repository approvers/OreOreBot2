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
  createdAt: Date;
  icon?: RoleIcon;
  numOfMembersBelonged: number;
  position: number;
}

export interface RoleStatsRepository {
  fetchStats(roleId: string): Promise<RoleStats | null>;
}

const SCHEMA = {
  names: ['roleinfo'],
  subCommands: {},
  params: [
    {
      type: 'ROLE',
      name: 'ロールID',
      description: 'このIDのロールを調べるよ'
    }
  ]
} as const;

export class RoleInfo implements CommandResponder<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'ロール秘書艦',
    description: '指定したロールの情報を調べてくるよ'
  };
  readonly schema = SCHEMA;

  constructor(private readonly repo: RoleStatsRepository) {}

  async on(
    event: MessageEvent,
    message: CommandMessage<typeof SCHEMA>
  ): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }
    const [roleId] = message.args.params;

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
    const timeStampSeconds = Math.floor(createdAt.getTime() / 1000);
    const fields = [
      {
        name: 'ID',
        value: `${roleId}`,
        inline: true
      },
      {
        name: '作成日時',
        value: `<t:${timeStampSeconds}>`,
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
