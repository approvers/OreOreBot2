import { afterEach, describe, expect, it, vi } from 'vitest';

import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';
import type { Snowflake } from '../../model/id.js';
import { createMockMessage } from './command-message.js';
import { UserInfo, type UserStatsRepository } from './user-info.js';

describe('UserInfo', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const repo: UserStatsRepository = {
    fetchUserStats: (id) =>
      Promise.resolve(
        id === '586824421470109716'
          ? {
              color: 'f08f8f',
              displayName: 'める',
              joinedAt: new Date(20050902),
              createdAt: new Date(20050902),
              bot: false,
              userName: 'meru#0',
              hoistRoleId: '865951894173515786' as Snowflake
            }
          : null
      )
  };
  const userInfo = new UserInfo(repo);

  it('gets info of user', async () => {
    const fetchStats = vi.spyOn(repo, 'fetchUserStats');
    const fn = vi.fn();

    await userInfo.on(
      createMockMessage(
        parseStringsOrThrow(
          ['userinfo', '586824421470109716'],
          userInfo.schema
        ),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'ユーザーの情報',
      description: '司令官、頼まれていた <@586824421470109716> の情報だよ',
      fields: [
        {
          name: 'ID',
          value: '586824421470109716',
          inline: true
        },
        {
          name: '表示名',
          value: 'める',
          inline: true
        },
        {
          name: 'ユーザーネーム',
          value: 'meru',
          inline: true
        },
        {
          name: 'プロフィールカラー',
          value: 'f08f8f',
          inline: true
        },
        {
          name: 'ユーザ種別',
          value: '人類',
          inline: true
        },
        {
          name: 'メンバーリストの分類ロール',
          value: '<@&865951894173515786>',
          inline: true
        },
        {
          name: 'サーバー参加日時',
          value: `<t:20050>(<t:20050:R>)`,
          inline: true
        },
        {
          name: 'アカウント作成日時',
          value: `<t:20050>(<t:20050:R>)`,
          inline: true
        }
      ]
    });
    expect(fetchStats).toHaveBeenCalledOnce();
  });

  it('gets info self', async () => {
    const fetchStats = vi.spyOn(repo, 'fetchUserStats');
    const fn = vi.fn();

    await userInfo.on(
      createMockMessage(
        parseStringsOrThrow(['userinfo'], userInfo.schema),
        fn,
        {
          senderId: '586824421470109716' as Snowflake
        }
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'ユーザーの情報',
      description: '司令官、頼まれていた <@586824421470109716> の情報だよ',
      fields: [
        {
          name: 'ID',
          value: '586824421470109716',
          inline: true
        },
        {
          name: '表示名',
          value: 'める',
          inline: true
        },
        {
          name: 'ユーザーネーム',
          value: 'meru',
          inline: true
        },
        {
          name: 'プロフィールカラー',
          value: 'f08f8f',
          inline: true
        },
        {
          name: 'ユーザ種別',
          value: '人類',
          inline: true
        },
        {
          name: 'メンバーリストの分類ロール',
          value: '<@&865951894173515786>',
          inline: true
        },
        {
          name: 'サーバー参加日時',
          value: `<t:20050>(<t:20050:R>)`,
          inline: true
        },
        {
          name: 'アカウント作成日時',
          value: `<t:20050>(<t:20050:R>)`,
          inline: true
        }
      ]
    });
    expect(fetchStats).toHaveBeenCalledOnce();
  });

  it('error with invalid arg', async () => {
    const fetchStats = vi.spyOn(repo, 'fetchUserStats');
    const fn = vi.fn();

    await userInfo.on(
      createMockMessage(
        parseStringsOrThrow(
          ['userinfo', '354996809447505920'],
          userInfo.schema
        ),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: '引数エラー',
      description: '指定したユーザーは存在しないよ'
    });
    expect(fetchStats).toHaveBeenCalledOnce();
  });
});

// "UserInfo" として定義してもいいが、見通し良くするために新しいスイートを定義する
describe('BotInfo', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const repo: UserStatsRepository = {
    fetchUserStats: (id) =>
      Promise.resolve(
        id === '279614913129742338'
          ? {
              color: 'f08f8f',
              displayName: 'さいな',
              joinedAt: new Date(20230721),
              createdAt: new Date(20230721),
              bot: true,
              userName: 'mikuro#2796',
              hoistRoleId: '865951894173515786' as Snowflake
            }
          : null
      )
  };
  const userInfo = new UserInfo(repo);

  it('gets info bot user (old username system)', async () => {
    const fetchStats = vi.spyOn(repo, 'fetchUserStats');
    const fn = vi.fn();

    await userInfo.on(
      createMockMessage(
        parseStringsOrThrow(
          ['userinfo', '279614913129742338'],
          userInfo.schema
        ),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'ユーザーの情報',
      description: '司令官、頼まれていた <@279614913129742338> の情報だよ',
      fields: [
        {
          name: 'ID',
          value: '279614913129742338',
          inline: true
        },
        {
          name: '表示名',
          value: 'さいな',
          inline: true
        },
        {
          name: 'ユーザーネーム',
          value: 'mikuro#2796',
          inline: true
        },
        {
          name: 'プロフィールカラー',
          value: 'f08f8f',
          inline: true
        },
        {
          name: 'ユーザ種別',
          value: 'ボット',
          inline: true
        },
        {
          name: 'メンバーリストの分類ロール',
          value: '<@&865951894173515786>',
          inline: true
        },
        {
          name: 'サーバー参加日時',
          value: `<t:20230>(<t:20230:R>)`,
          inline: true
        },
        {
          name: 'アカウント作成日時',
          value: `<t:20230>(<t:20230:R>)`,
          inline: true
        }
      ]
    });
    expect(fetchStats).toHaveBeenCalledOnce();
  });
});
