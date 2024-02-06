import type { Dep0 } from '../driver/dep-registry.js';

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

export interface RoleRepository {
  fetchStats(roleId: string): Promise<RoleStats | null>;

  createRole(
    roleName: string,
    roleColor: string,
    createSenderName: string
  ): Promise<void>;
}
export interface RoleRepositoryDep extends Dep0 {
  type: RoleRepository;
}
export const roleRepositoryKey = Symbol(
  'ROLE_REPOSITORY'
) as unknown as RoleRepositoryDep;
