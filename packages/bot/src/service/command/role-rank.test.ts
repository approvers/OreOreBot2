import { afterEach, describe, expect, it, vi } from 'vitest';

import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';
import { DepRegistry } from '../../driver/dep-registry.js';
import {
  dummyMemberRepository,
  membersRepositoryKey,
  type MemberRepository
} from '../../model/member.js';
import { createMockMessage } from './command-message.js';
import { RoleRank } from './role-rank.js';

describe('RoleRank', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const repo: MemberRepository = {
    ...dummyMemberRepository,
    fetchMembersWithRole: () =>
      Promise.resolve([
        {
          displayName: 'Baba Is Baba',
          roles: 8
        },
        {
          displayName: 'Keke',
          roles: 5
        },
        {
          displayName: 'Meme',
          roles: 12
        },
        {
          displayName: 'Morizo',
          roles: 2
        },
        {
          displayName: 'Alpaca',
          roles: 3
        },
        {
          displayName: 'Bird',
          roles: 4
        }
      ])
  };
  const reg = new DepRegistry();
  reg.add(membersRepositoryKey, repo);
  const roleRank = new RoleRank(reg);

  it('ranks members', async () => {
    const fetchMembersWithRole = vi.spyOn(repo, 'fetchMembersWithRole');
    const fn = vi.fn();

    await roleRank.on(
      createMockMessage(parseStringsOrThrow(['rolerank'], roleRank.schema), fn)
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'ロール数ランキング',
      fields: [
        {
          name: '1 位',
          value: 'Meme : 12 個'
        },
        {
          name: '2 位',
          value: 'Baba Is Baba : 8 個'
        },
        {
          name: '3 位',
          value: 'Keke : 5 個'
        },
        {
          name: '4 位',
          value: 'Bird : 4 個'
        },
        {
          name: '5 位',
          value: 'Alpaca : 3 個'
        }
      ]
    });
    expect(fetchMembersWithRole).toHaveBeenCalledOnce();
  });
});
