import { UserInfo, UserStatsRepository } from './user-info.js';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMockMessage } from './command-message.js';

describe('UserInfo', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const repo: UserStatsRepository = {
    fetchStats: (id) =>
      Promise.resolve(
        id === '586824421470109716'
          ? {
              displayName: 'める',
              tag: 'm2en#0092',
              color: 'f08f8f',
              joinedAt: new Date(20050902),
              bot: false
            }
          : null
      )
  };
  const userInfo = new UserInfo(repo);

  it('gets info of user', async () => {
    const fetchStats = vi.spyOn(repo, 'fetchStats');
    const fn = vi.fn();

    await userInfo.on(
      'CREATE',
      createMockMessage(
        {
          args: ['userinfo', '586824421470109716']
        },
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
          name: 'ユーザー名+Discord Tag',
          value: 'm2en#0092',
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
          name: '参加日時',
          value: `<t:20050>`,
          inline: true
        }
      ]
    });
    expect(fetchStats).toHaveBeenCalledOnce();
  });

  it('error with no arg', async () => {
    const fetchStats = vi.spyOn(repo, 'fetchStats');
    const fn = vi.fn();

    await userInfo.on(
      'CREATE',
      createMockMessage(
        {
          args: ['userinfo']
        },
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'コマンド形式エラー',
      description: '引数にユーザーIDの文字列を指定してね'
    });
    expect(fetchStats).not.toHaveBeenCalled();
  });

  it('error with invalid arg', async () => {
    const fetchStats = vi.spyOn(repo, 'fetchStats');
    const fn = vi.fn();

    await userInfo.on(
      'CREATE',
      createMockMessage(
        {
          args: ['userinfo', '354996809447505920']
        },
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: '引数エラー',
      description: '指定したユーザーは存在しないよ'
    });
    expect(fetchStats).not.toHaveBeenCalled();
  });
});
