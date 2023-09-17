import type { Snowflake } from '../model/id.js';
import type { RoleEvent, RoleEventResponder } from '../runner/index.js';
import type { StandardOutput } from './output.js';

export interface NewRole {
  roleId: Snowflake;
  name: string;
}

export interface RoleManager {
  addRole(targetMember: Snowflake, newRoleId: Snowflake): Promise<void>;
  removeRole(targetMember: Snowflake, removingRoleId: Snowflake): Promise<void>;
}

export class KawaemonHasAllRoles implements RoleEventResponder<NewRole> {
  constructor(
    private readonly kawaemonId: Snowflake,
    private readonly manager: RoleManager,
    private readonly output: StandardOutput
  ) {}

  async on(event: RoleEvent, role: NewRole): Promise<void> {
    switch (event) {
      case 'CREATE':
        await this.manager.addRole(this.kawaemonId, role.roleId);
        await this.output.sendEmbed({
          title: '***Kawaemon has given a new role***',
          description: `<@&${role.roleId}>をかわえもんにもつけといたよ。`
        });
        return;
    }
  }
}
