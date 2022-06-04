import { KawaemonHasAllRoles } from './kawaemon-has-all-roles';
import type { Snowflake } from '../model/id';

const KAWAEMON_ID = '391857452360007680' as Snowflake;

test('kawaemon get a new role', async () => {
  const newRoleId = '18475613045613281703151' as Snowflake;
  const addRole = jest.fn(() => Promise.resolve());
  const removeRole = jest.fn(() => Promise.resolve());
  const sendEmbed = jest.fn(() => Promise.resolve());
  const responder = new KawaemonHasAllRoles(
    KAWAEMON_ID,
    { addRole, removeRole },
    { sendEmbed }
  );

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

test('kawaemon drop a new role', async () => {
  const updatedRoleId = '18475613045613281703151' as Snowflake;
  const addRole = jest.fn(() => Promise.resolve());
  const removeRole = jest.fn(() => Promise.resolve());
  const sendEmbed = jest.fn(() => Promise.resolve());
  const responder = new KawaemonHasAllRoles(
    KAWAEMON_ID,
    { addRole, removeRole },
    { sendEmbed }
  );

  await responder.on('UPDATE', {
    roleId: updatedRoleId,
    name: '限界ポイント8000超え'
  });

  expect(addRole).not.toHaveBeenCalled();
  expect(removeRole).toHaveBeenCalledWith(KAWAEMON_ID, updatedRoleId);
  expect(sendEmbed).toHaveBeenCalledWith({
    title: '***Kawaemon has dropped a new role***',
    description: `<@&18475613045613281703151>をかわえもんからはずしといたよ。`
  });
});

test('must not drop a new role', async () => {
  const updatedRoleId = '18475613045613281703151' as Snowflake;
  const addRole = jest.fn(() => Promise.resolve());
  const removeRole = jest.fn(() => Promise.resolve());
  const sendEmbed = jest.fn(() => Promise.resolve());
  const responder = new KawaemonHasAllRoles(
    KAWAEMON_ID,
    { addRole, removeRole },
    { sendEmbed }
  );

  await responder.on('UPDATE', {
    roleId: updatedRoleId,
    name: 'YEAH'
  });

  expect(addRole).not.toHaveBeenCalled();
  expect(removeRole).not.toHaveBeenCalled();
  expect(sendEmbed).not.toHaveBeenCalled();
});
