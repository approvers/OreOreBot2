import type { RoleEvent, RoleEventResponder } from '../runner';
import type { Snowflake } from '../model/id';
import type { StandardOutput } from './output';

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
      case 'UPDATE':
        // 限界ポイント1000超えなどはこの形式で始まる. 詳細: https://github.com/approvers/OreOreBot2/issues/155
        if (!role.name.startsWith('限界ポイント')) {
          return;
        }
        await this.manager.removeRole(this.kawaemonId, role.roleId);
        await this.output.sendEmbed({
          title: '***Kawaemon has dropped a new role***',
          description: `<@&${role.roleId}>をかわえもんからはずしといたよ。`
        });
        return;
    }
  }
}
