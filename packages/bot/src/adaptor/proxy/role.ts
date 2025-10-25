import type { Client, Role } from 'discord.js';

import type { Snowflake } from '../../model/id.js';
import type { RoleResponseRunner } from '../../runner/index.js';
import type { NewRole } from '../../service/kawaemon-has-all-roles.js';

type AllRoleModel = NewRole;

const map: (role: Role) => AllRoleModel = (role) => ({
  roleId: role.id as Snowflake,
  name: role.name
});

export const roleProxy = (
  client: Client,
  runner: RoleResponseRunner<AllRoleModel>
) => {
  client.on('roleCreate', (role) => {
    void runner.triggerEvent('CREATE', map(role));
  });
  client.on('roleUpdate', (_, role) => {
    void runner.triggerEvent('UPDATE', map(role));
  });
};
