import {
  ActualClock,
  DiscordOutput,
  DiscordParticipant,
  DiscordVoiceConnectionFactory,
  DiscordVoiceRoomController,
  EmojiProxy,
  InMemoryReservationRepository,
  InMemoryTypoRepository,
  MathRandomGenerator,
  MessageProxy,
  MessageUpdateProxy,
  VoiceRoomProxy,
  roleProxy,
  transformerForCommand,
  transformerForMessage,
  transformerForUpdateMessage
} from '../adaptor/index.js';
import { Client, GatewayIntentBits, version } from 'discord.js';
import type {
  CommandMessage,
  CommandResponder
} from '../service/command/command-message.js';
import {
  EmojiResponseRunner,
  MessageResponseRunner,
  MessageUpdateResponseRunner,
  RoleResponseRunner,
  ScheduleRunner,
  VoiceRoomResponseRunner
} from '../runner/index.js';
import {
  type VoiceChannelParticipant,
  VoiceDiff
} from '../service/voice-diff.js';
import {
  allEmojiResponder,
  allMessageEventResponder,
  allMessageUpdateEventResponder,
  allRoleResponder,
  registerAllCommandResponder
} from '../service/index.js';
import type { AssetKey } from '../service/command/party.js';
import { DiscordMemberStats } from '../adaptor/discord/member-stats.js';
import { DiscordMessageRepository } from '../adaptor/discord/message-repo.js';
import { DiscordRoleManager } from '../adaptor/discord/role.js';
import { DiscordSheriff } from '../adaptor/discord/sheriff.js';
import { DiscordWS } from '../adaptor/discord/ws.js';
import { GenVersionFetcher } from '../adaptor/version/fetch.js';
import type { KaereMusicKey } from '../service/command/kaere.js';
import { Snowflake } from '../model/id.js';
import dotenv from 'dotenv';
import { extractEnv } from './extract-env.js';
import { generateDependencyReport } from '@discordjs/voice';
import { join } from 'node:path';
import { loadEmojiSeqYaml } from '../adaptor/emoji-seq-loader.js';

dotenv.config();
const {
  DISCORD_TOKEN: token,
  MAIN_CHANNEL_ID: mainChannelId,
  GUILD_ID,
  PREFIX,
  FEATURE
} = extractEnv(
  ['DISCORD_TOKEN', 'MAIN_CHANNEL_ID', 'GUILD_ID', 'PREFIX', 'FEATURE'],
  {
    PREFIX: '!',
    FEATURE: 'MESSAGE_CREATE,MESSAGE_UPDATE,COMMAND,VOICE_ROOM,ROLE,EMOJI'
  }
);

const features = FEATURE.split(',');

const intents = [
  GatewayIntentBits.Guilds, // GUILD_CREATE ??????????????????
  GatewayIntentBits.GuildMessages, // ???????????????????????????????????????????????????
  GatewayIntentBits.GuildVoiceStates, // VoiceDiff ??????
  GatewayIntentBits.GuildEmojisAndStickers // EmojiLog??????
];

const client = new Client({ intents });

/* ?????????????????????????????????????????????????????? */
function readyLog(client: Client): void {
  const connectionClient = client.user;
  const projectVersion = process.env.npm_package_version ?? '??????';
  if (connectionClient == null) return;
  console.info('============');
  console.info('');
  console.info('???????????????????????????');
  console.info('');
  console.info('??????????????????????????????> ' + features.join(', '));
  console.info('');
  console.info('????????????????????????> ' + connectionClient.username);
  console.info('????????????????????????ID> ' + connectionClient.id);
  console.info('???????????????????????????????????????> ' + projectVersion);
  console.info('');
  console.info('discord.js ???????????????> ' + version);
  console.info('');
  console.info(generateDependencyReport());
  console.info('');
  console.info('============');
}

const typoRepo = new InMemoryTypoRepository();
const reservationRepo = new InMemoryReservationRepository();
const clock = new ActualClock();
const sequencesYaml = loadEmojiSeqYaml(['assets', 'emoji-seq.yaml']);

const messageCreateRunner = new MessageResponseRunner(
  new MessageProxy(client, transformerForMessage())
);
if (features.includes('MESSAGE_CREATE')) {
  messageCreateRunner.addResponder(
    allMessageEventResponder(typoRepo, sequencesYaml)
  );
}

const messageUpdateRunner = new MessageUpdateResponseRunner(
  new MessageUpdateProxy(client, transformerForUpdateMessage())
);
if (features.includes('MESSAGE_UPDATE')) {
  messageUpdateRunner.addResponder(allMessageUpdateEventResponder());
}

const scheduleRunner = new ScheduleRunner(clock);

const commandRunner: MessageResponseRunner<CommandMessage, CommandResponder> =
  new MessageResponseRunner(
    new MessageProxy(client, transformerForCommand(PREFIX))
  );
const stats = new DiscordMemberStats(client, GUILD_ID as Snowflake);

// ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
const KAWAEMON_ID = '391857452360007680' as Snowflake;
const roleManager = new DiscordRoleManager(client, GUILD_ID as Snowflake);

if (features.includes('COMMAND')) {
  registerAllCommandResponder({
    typoRepo,
    reservationRepo,
    factory: new DiscordVoiceConnectionFactory<AssetKey | KaereMusicKey>(
      client,
      {
        COFFIN_INTRO: join('assets', 'party', 'coffin-intro.mp3'),
        COFFIN_DROP: join('assets', 'party', 'coffin-drop.mp3'),
        KAKAPO: join('assets', 'party', 'kakapo.mp3'),
        KAKUSIN_DAISUKE: join('assets', 'party', 'kakusin-daisuke.mp3'),
        NEROYO: join('assets', 'kaere', 'neroyo.mp3')
      }
    ),
    clock,
    scheduleRunner,
    random: new MathRandomGenerator(),
    roomController: new DiscordVoiceRoomController(client),
    commandRunner,
    stats,
    sheriff: new DiscordSheriff(client),
    ping: new DiscordWS(client),
    fetcher: new GenVersionFetcher(),
    messageRepo: new DiscordMessageRepository(client),
    membersRepo: stats,
    roleRepo: roleManager
  });
}

const provider = new VoiceRoomProxy<VoiceChannelParticipant>(
  client,
  (voiceState) => new DiscordParticipant(voiceState)
);
const voiceRoomRunner = new VoiceRoomResponseRunner(provider);
const output = new DiscordOutput(client, mainChannelId);
if (features.includes('VOICE_ROOM')) {
  voiceRoomRunner.addResponder(new VoiceDiff(output));
}

const roleRunner = new RoleResponseRunner();
if (features.includes('ROLE')) {
  roleRunner.addResponder(
    allRoleResponder({
      kawaemonId: KAWAEMON_ID,
      roleManager,
      output
    })
  );
  roleProxy(client, roleRunner);
}

const emojiRunner = new EmojiResponseRunner(new EmojiProxy(client));
if (features.includes('EMOJI')) {
  emojiRunner.addResponder(allEmojiResponder(output));
}

client.once('ready', () => {
  readyLog(client);
});

client.login(token).catch(console.error);
