import { Client } from 'discord.js';
import { MemberStats } from '../service/kokusei-chousa';
import { Snowflake } from '../model/id';

export class DiscordMemberStats implements MemberStats {
  constructor(private client: Client, private readonly guildId: Snowflake) {}

  async allMemberCount(): Promise<number> {
    const guild = await this.client.guilds.fetch(this.guildId);
    if (!guild) {
      throw new Error('guild not found');
    }
    return guild.memberCount;
  }

  async botMemberCount(): Promise<number> {
    const guild = await this.client.guilds.fetch(this.guildId);
    if (!guild) {
      throw new Error('guild not found');
    }
    const guildMemberList = await guild.members.list({ limit: 1000 });
    return guildMemberList.filter((member) => member.user.bot).size;
  }
}
