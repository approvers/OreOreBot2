import type { RoleEvent, RoleEventResponder } from '../runner/role';
import type { Snowflake } from '../model/id';

export interface NewRole {
  roleId: Snowflake;
}

export interface RoleManager {
  addRole(targetMember: Snowflake, newRoleId: Snowflake): Promise<void>;
}

export class KawaemonHasAllRoles implements RoleEventResponder<NewRole> {
  constructor(
    private readonly kawaemonId: Snowflake,
    private readonly manager: RoleManager
  ) {}

  async on(event: RoleEvent, role: NewRole): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }
    await this.manager.addRole(this.kawaemonId, role.roleId);
  }
}
