import { beforeEach, describe, expect, it, spyOn, mock } from 'bun:test';

import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';
import { DepRegistry } from '../../driver/dep-registry.js';
import type { Snowflake } from '../../model/id.js';
import {
  dummyMemberRepository,
  membersRepositoryKey,
  type MemberRepository
} from '../../model/member.js';
import { createMockMessage } from './command-message.js';
import { UserInfo } from './user-info.js';

describe('UserInfo', () => {
  const repo: MemberRepository = {
    ...dummyMemberRepository,
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
              hoistRoleId: '865951894173515786' as Snowflake,
              avatarUrl: 'https://example.com/meru.png'
            }
          : null
      )
  };
  const fetchStats = spyOn(repo, 'fetchUserStats');
  const reg = new DepRegistry();
  reg.add(membersRepositoryKey, repo);
  const userInfo = new UserInfo(reg);

  beforeEach(() => {
    fetchStats.mockClear();
  });

  it('gets info of user', async () => {
    const fn = mock();

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
      ],
      thumbnail: { url: 'https://example.com/meru.png' }
    });
    expect(fetchStats).toHaveBeenCalledTimes(1);
  });

  it('gets info self', async () => {
    const fn = mock();

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
      ],
      thumbnail: { url: 'https://example.com/meru.png' }
    });
    expect(fetchStats).toHaveBeenCalledTimes(1);
  });

  it('error with invalid arg', async () => {
    const fn = mock();

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
    expect(fetchStats).toHaveBeenCalledTimes(1);
  });
});

// "UserInfo" として定義してもいいが、見通し良くするために新しいスイートを定義する
describe('BotInfo', () => {
  const repo: MemberRepository = {
    ...dummyMemberRepository,
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
              hoistRoleId: '865951894173515786' as Snowflake,
              avatarUrl: 'https://example.com/mikuro.png'
            }
          : null
      )
  };
  const fetchStats = spyOn(repo, 'fetchUserStats');
  const reg = new DepRegistry();
  reg.add(membersRepositoryKey, repo);
  const userInfo = new UserInfo(reg);

  beforeEach(() => {
    fetchStats.mockClear();
  });

  it('gets info bot user (old username system)', async () => {
    const fn = mock();

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
      ],
      thumbnail: { url: 'https://example.com/mikuro.png' }
    });
    expect(fetchStats).toHaveBeenCalledTimes(1);
  });
});
