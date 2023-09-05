import type { Client, GuildMember } from 'discord.js';

import type { Snowflake } from '../../model/id.js';
import type { MemberResponseRunner } from '../../runner/member.js';
import type { NewMember as AllMemberModel } from '../../service/welcome-message.js';

const map: (member: GuildMember) => AllMemberModel = (member) => ({
  userId: member.id as Snowflake,
  isBot: member.user.bot
});

export const memberProxy = (
  client: Client,
  runner: MemberResponseRunner<AllMemberModel>
) => {
  client.on('guildMemberAdd', (member) =>
    runner.triggerEvent('JOIN', map(member))
  );
};
