import { beforeEach, describe, expect, it, spyOn } from 'bun:test';

import type { Snowflake } from '../model/id.js';
import {
  KawaemonHasAllRoles,
  type RoleManager
} from './kawaemon-has-all-roles.js';
import type { StandardOutput } from './output.js';

const KAWAEMON_ID = '391857452360007680' as Snowflake;

describe('kawaemon has all roles', () => {
  const manager: RoleManager = {
    addRole: () => Promise.resolve(),
    removeRole: () => Promise.resolve()
  };
  const output: StandardOutput = { sendEmbed: () => Promise.resolve() };
  const responder = new KawaemonHasAllRoles(KAWAEMON_ID, manager, output);
  const addRole = spyOn(manager, 'addRole');
  const removeRole = spyOn(manager, 'removeRole');
  const sendEmbed = spyOn(output, 'sendEmbed');

  beforeEach(() => {
    addRole.mockClear();
    removeRole.mockClear();
    sendEmbed.mockClear();
  });

  it('kawaemon get a new role', async () => {
    const newRoleId = '18475613045613281703151' as Snowflake;

    await responder.on('CREATE', {
      roleId: newRoleId,
      name: 'hoge'
    });

    expect(addRole).toHaveBeenCalledWith(KAWAEMON_ID, newRoleId);
    expect(removeRole).not.toHaveBeenCalled();
    expect(sendEmbed).toHaveBeenCalledWith({
      title: '***Kawaemon has given a new role***',
      description: `<@&18475613045613281703151>をかわえもんにもつけといたよ。`
    });
  });

  it('must not drop a new role', async () => {
    const updatedRoleId = '18475613045613281703151' as Snowflake;
    const addRole = spyOn(manager, 'addRole');
    const removeRole = spyOn(manager, 'removeRole');
    const sendEmbed = spyOn(output, 'sendEmbed');

    await responder.on('UPDATE', {
      roleId: updatedRoleId,
      name: 'YEAH'
    });

    expect(addRole).not.toHaveBeenCalled();
    expect(removeRole).not.toHaveBeenCalled();
    expect(sendEmbed).not.toHaveBeenCalled();
  });
});
