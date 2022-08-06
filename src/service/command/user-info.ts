import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';
import type { MessageEvent } from '../../runner/message.js';
import type { Snowflake } from '../../model/id.js';

export interface UserStats {
  color: string;
  displayName: string;
  joinedAt?: Date;
  createdAt: Date;
  bot: boolean;
  tag: string;
  hoistRoleId?: Snowflake | undefined;
}

export interface UserStatsRepository {
  fetchStats(userId: string): Promise<UserStats | null>;
}

export class UserInfo implements CommandResponder {
  help: Readonly<HelpInfo> = {
    title: 'ユーザー秘書艦',
    description:
      '指定したユーザーの情報を調べてくるよ。限界開発鯖のメンバーしか検索できないから注意してね。',
    commandName: ['userinfo'],
    argsFormat: [
      {
        name: 'ユーザーID',
        description: 'このIDのロールを調べるよ'
      }
    ]
  };

  constructor(private readonly repo: UserStatsRepository) {}

  async on(event: MessageEvent, message: CommandMessage): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }

    const [command, userId] = message.args;

    if (!this.help.commandName.includes(command)) {
      return;
    }

    if (typeof userId !== 'string') {
      await message.reply({
        title: 'コマンド形式エラー',
        description: '引数にユーザーIDの文字列を指定してね'
      });
      return;
    }

    const stats = await this.repo.fetchStats(userId);
    if (!stats) {
      await message.reply({
        title: '引数エラー',
        description: '指定したユーザーは存在しないよ'
      });
      return;
    }

    await message.reply(this.buildEmbed(stats, userId));
  }

  private buildEmbed(
    {
      color,
      displayName,
      joinedAt,
      createdAt,
      bot,
      tag,
      hoistRoleId
    }: UserStats,
    userId: string
  ) {
    const fields = [
      {
        name: 'ID',
        value: userId,
        inline: true
      },
      {
        name: '表示名',
        value: displayName,
        inline: true
      },
      {
        name: 'ユーザー名+Discord Tag',
        value: tag,
        inline: true
      },
      {
        name: 'プロフィールカラー',
        value: color,
        inline: true
      },
      {
        name: 'ユーザ種別',
        value: bot ? 'ボット' : '人類',
        inline: true
      },
      {
        name: 'メンバーリストロール(最上位)',
        value: createHoistRoleDisplay(hoistRoleId),
        inline: true
      },
      {
        name: '参加日時',
        value: createJoinTimeStamp(joinedAt),
        inline: true
      },
      {
        name: 'アカウント作成日時',
        value: createCreateTimeStamp(createdAt),
        inline: true
      }
    ];

    return {
      title: `ユーザーの情報`,
      description: `司令官、頼まれていた <@${userId}> の情報だよ`,
      fields
    };
  }
}

function createJoinTimeStamp(joinedAt: Date | undefined): string {
  if (!joinedAt) {
    return '情報なし';
  }

  const unixTime = Math.floor(joinedAt.getTime() / 1000);
  return `<t:${unixTime}>(<t:${unixTime}:R>)`;
}

function createCreateTimeStamp(createAt: Date): string {
  const unixTime = Math.floor(createAt.getTime() / 1000);
  return `<t:${unixTime}>(<t:${unixTime}:R>)`;
}

function createHoistRoleDisplay(hoistRoleId: Snowflake | undefined): string {
  if (!hoistRoleId) {
    return 'なし';
  }

  return `<@&${hoistRoleId}>`;
}
