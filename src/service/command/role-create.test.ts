import { afterEach, describe, expect, it, vi } from 'vitest';

import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';
import { createMockMessage } from './command-message.js';
import { RoleCreate, type RoleCreateManager } from './role-create.js';

describe('Create a role', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const manager: RoleCreateManager = {
    createRole: () => Promise.resolve()
  };
  const createRole = new RoleCreate(manager);

  it('create a role(command)', async () => {
    const newRoleName = 'かわえもんのおねえさん';
    const newRoleColor = '141313'; //黒
    const createGuildRole = vi.spyOn(manager, 'createRole');
    const fn = vi.fn();

    await createRole.on(
      createMockMessage(
        parseStringsOrThrow(
          ['rolecreate', newRoleName, newRoleColor],
          createRole.schema
        ),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'ロール作成',
      description: 'ロールを作成したよ'
    });
    expect(createGuildRole).toHaveBeenCalledWith(
      newRoleName,
      newRoleColor,
      'Mikuroさいな'
    );
  });

  it('create a role(lower case)', async () => {
    const newRoleName = 'かわえもんのおねえさん';
    const newRoleColor = 'faac9b'; //黒
    const createGuildRole = vi.spyOn(manager, 'createRole');
    const fn = vi.fn();

    await createRole.on(
      createMockMessage(
        parseStringsOrThrow(
          ['rolecreate', newRoleName, newRoleColor],
          createRole.schema
        ),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'ロール作成',
      description: 'ロールを作成したよ'
    });
    expect(createGuildRole).toHaveBeenCalledWith(
      newRoleName,
      newRoleColor,
      'Mikuroさいな'
    );
  });

  it('create a role(big letter)', async () => {
    const newRoleName = 'かわえもんのおねえさん';
    const newRoleColor = 'FAAC9B'; //黒
    const createGuildRole = vi.spyOn(manager, 'createRole');
    const fn = vi.fn();

    await createRole.on(
      createMockMessage(
        parseStringsOrThrow(
          ['rolecreate', newRoleName, newRoleColor],
          createRole.schema
        ),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'ロール作成',
      description: 'ロールを作成したよ'
    });
    expect(createGuildRole).toHaveBeenCalledWith(
      newRoleName,
      newRoleColor,
      'Mikuroさいな'
    );
  });

  it('HEX Error (rolecolor)', async () => {
    const newRoleName = 'かわえもんのおねえさん';
    const createGuildRole = vi.spyOn(manager, 'createRole');
    const fn = vi.fn();

    await createRole.on(
      createMockMessage(
        parseStringsOrThrow(
          ['rolecreate', newRoleName, 'fffffff'],
          createRole.schema
        ),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'コマンド形式エラー',
      description:
        '引数のHEXが6桁の16進数でないよ。HEXは`000000`から`FFFFFF`までの6桁の16進数だよ'
    });
    expect(createGuildRole).not.toHaveBeenCalled();
  });

  it('HEX sharp mark', async () => {
    const newRoleName = 'かわえもんのおねえさん';
    const createGuildRole = vi.spyOn(manager, 'createRole');
    const fn = vi.fn();

    await createRole.on(
      createMockMessage(
        parseStringsOrThrow(
          ['rolecreate', newRoleName, '#ffffff'],
          createRole.schema
        ),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'ロール作成',
      description: 'ロールを作成したよ'
    });
    expect(createGuildRole).toHaveBeenCalledWith(
      newRoleName,
      'ffffff',
      'Mikuroさいな'
    );
  });
});
