import { KawaemonHasAllRoles } from './kawaemon-has-all-roles';
import type { Snowflake } from '../model/id';

const KAWAEMON_ID = '391857452360007680' as Snowflake;

test('kawaemon get a new role', async () => {
  const newRoleId = '18475613045613281703151' as Snowflake;
  const addRole = jest.fn(() => Promise.resolve());
  const sendEmbed = jest.fn(() => Promise.resolve());
  const responder = new KawaemonHasAllRoles(
    KAWAEMON_ID,
    { addRole },
    { sendEmbed }
  );

  await responder.on('CREATE', {
    roleId: newRoleId
  });

  expect(addRole).toHaveBeenCalledWith(KAWAEMON_ID, newRoleId);
  expect(sendEmbed).toHaveBeenCalledWith({
    title: '***Kawaemon has given a new role***',
    description: `<@&18475613045613281703151>をかわえもんにもつけといたよ。`
  });
});
