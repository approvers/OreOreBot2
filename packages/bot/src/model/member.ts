import type { Dep0 } from '../driver/dep-registry.js';
import type { Snowflake } from './id.js';

export interface MemberWithRole {
  displayName: string;
  roles: number;
}

export interface UserStats {
  color: string;
  displayName: string;
  joinedAt?: Date;
  createdAt: Date;
  bot: boolean;
  userName: string;
  hoistRoleId?: Snowflake | undefined;
  avatarUrl: string;
}

export interface MemberRepository {
  fetchMembersWithRole(): Promise<MemberWithRole[]>;
  fetchUserStats(userId: string): Promise<UserStats | null>;
}
export interface MemberRepositoryDep extends Dep0 {
  type: MemberRepository;
}
export const membersRepositoryKey = Symbol(
  'MEMBERS_REPOSITORY'
) as unknown as MemberRepositoryDep;
