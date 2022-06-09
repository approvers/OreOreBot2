import { KawaemonHasAllRoles, RoleManager } from './kawaemon-has-all-roles';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Snowflake } from '../model/id';
import { StandardOutput } from './output';

const KAWAEMON_ID = '391857452360007680' as Snowflake;

describe('kawaemon has all roles', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const manager: RoleManager = {
    addRole: () => Promise.resolve(),
    removeRole: () => Promise.resolve()
  };
  const output: StandardOutput = { sendEmbed: () => Promise.resolve() };
  const responder = new KawaemonHasAllRoles(KAWAEMON_ID, manager, output);

  it('kawaemon get a new role', async () => {
    const newRoleId = '18475613045613281703151' as Snowflake;
    const addRole = vi.spyOn(manager, 'addRole');
    const removeRole = vi.spyOn(manager, 'removeRole');
    const sendEmbed = vi.spyOn(output, 'sendEmbed');

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

  it('kawaemon drop a new role', async () => {
    const updatedRoleId = '18475613045613281703151' as Snowflake;
    const addRole = vi.spyOn(manager, 'addRole');
    const removeRole = vi.spyOn(manager, 'removeRole');
    const sendEmbed = vi.spyOn(output, 'sendEmbed');

    await responder.on('UPDATE', {
      roleId: updatedRoleId,
      name: '限界ポイント8000超え'
    });

    expect(addRole).not.toHaveBeenCalled();
    expect(removeRole).toHaveBeenCalledWith(KAWAEMON_ID, updatedRoleId);
    expect(sendEmbed).toHaveBeenCalledWith({
      title: '***Kawaemon has dropped a new role***',
      description: `<@&18475613045613281703151>をかわえもんからはずしといたよ。`,
      fields: [
        {
          name: '理由',
          value: '限界ポイントと名のつくロールは自動で外すよ。'
        }
      ]
    });
  });

  it('must not drop a new role', async () => {
    const updatedRoleId = '18475613045613281703151' as Snowflake;
    const addRole = vi.spyOn(manager, 'addRole');
    const removeRole = vi.spyOn(manager, 'removeRole');
    const sendEmbed = vi.spyOn(output, 'sendEmbed');

    await responder.on('UPDATE', {
      roleId: updatedRoleId,
      name: 'YEAH'
    });

    expect(addRole).not.toHaveBeenCalled();
    expect(removeRole).not.toHaveBeenCalled();
    expect(sendEmbed).not.toHaveBeenCalled();
  });
});
