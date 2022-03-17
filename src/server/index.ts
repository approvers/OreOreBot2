import {
  ActualClock,
  DiscordOutput,
  DiscordParticipant,
  DiscordVoiceConnectionFactory,
  DiscordVoiceRoomController,
  InMemoryReservationRepository,
  InMemoryTypoRepository,
  MathRandomGenerator,
  MessageProxy,
  MessageUpdateProxy,
  VoiceRoomProxy,
  transformerForCommand,
  transformerForMessage,
  transformerForUpdateMessage
} from '../adaptor';
import { Client, Intents, version } from 'discord.js';
import type {
  CommandMessage,
  CommandResponder
} from '../service/command-message';
import {
  MessageResponseRunner,
  MessageUpdateResponseRunner,
  ScheduleRunner,
  VoiceRoomResponseRunner
} from '../runner';
import { type VoiceChannelParticipant, VoiceDiff } from '../service/voice-diff';
import {
  allMessageEventResponder,
  allMessageUpdateEventResponder,
  allRoleResponder,
  registerAllCommandResponder
} from '../service';
import type { AssetKey } from '../service/party';
import { DiscordRoleManager } from '../adaptor/discord-role';
import type { KaereMusicKey } from '../service/kaere';
import { RoleResponseRunner } from '../runner/role';
import { Snowflake } from '../model/id';
import dotenv from 'dotenv';
import { extractEnv } from './extract-env';
import { generateDependencyReport } from '@discordjs/voice';
import { join } from 'path';
import { roleProxy } from '../adaptor/role-proxy';

dotenv.config();
const {
  DISCORD_TOKEN: token,
  MAIN_CHANNEL_ID: mainChannelId,
  GUILD_ID
} = extractEnv(['DISCORD_TOKEN', 'MAIN_CHANNEL_ID', 'GUILD_ID']);

const intents = new Intents();
intents.add(
  Intents.FLAGS.GUILDS, // GUILD_CREATE による初期化
  Intents.FLAGS.GUILD_MESSAGES, // ほとんどのメッセージに反応する機能
  Intents.FLAGS.GUILD_VOICE_STATES // VoiceDiff 機能
);

const client = new Client({ intents });

/* 接続時にクライアントの情報を提供する */
function readyLog(client: Client): void {
  const connectionClient = client.user;
  const projectVersion = process.env.npm_package_version ?? '不明';
  if (connectionClient == null) return;
  console.info('============');
  console.info('');
  console.info('起動完了しました。');
  console.info('');
  console.info('接続クライアント> ' + connectionClient.username);
  console.info('接続クライアントID> ' + connectionClient.id);
  console.info('接続クライアントバージョン> ' + projectVersion);
  console.info('');
  console.info('discord.js バージョン> ' + version);
  console.info('');
  console.info(generateDependencyReport());
  console.info('');
  console.info('============');
}

const typoRepo = new InMemoryTypoRepository();
const reservationRepo = new InMemoryReservationRepository();
const clock = new ActualClock();

const runner = new MessageResponseRunner(
  new MessageProxy(client, transformerForMessage())
);
runner.addResponder(allMessageEventResponder(typoRepo));

const updateRunner = new MessageUpdateResponseRunner(
  new MessageUpdateProxy(client, transformerForUpdateMessage())
);
updateRunner.addResponder(allMessageUpdateEventResponder());

const scheduleRunner = new ScheduleRunner(clock);

const commandRunner: MessageResponseRunner<CommandMessage, CommandResponder> =
  new MessageResponseRunner(
    new MessageProxy(client, transformerForCommand('!'))
  );
registerAllCommandResponder(
  typoRepo,
  reservationRepo,
  new DiscordVoiceConnectionFactory<AssetKey | KaereMusicKey>(client, {
    COFFIN_INTRO: join('assets', 'party', 'coffin-intro.mp3'),
    COFFIN_DROP: join('assets', 'party', 'coffin-drop.mp3'),
    KAKAPO: join('assets', 'party', 'kakapo.mp3'),
    NEROYO: join('assets', 'kaere', 'neroyo.mp3')
  }),
  clock,
  scheduleRunner,
  new MathRandomGenerator(),
  new DiscordVoiceRoomController(client),
  commandRunner
);

const provider = new VoiceRoomProxy<VoiceChannelParticipant>(
  client,
  (voiceState) => new DiscordParticipant(voiceState)
);
const voiceRunner = new VoiceRoomResponseRunner(provider);
const output = new DiscordOutput(client, mainChannelId);
voiceRunner.addResponder(new VoiceDiff(output));

// ほとんど変わらないことが予想され環境変数で管理する必要性が薄いので、ハードコードした。
const KAWAEMON_ID = '391857452360007680' as Snowflake;

const roleRunner = new RoleResponseRunner();
roleRunner.addResponder(
  allRoleResponder(
    KAWAEMON_ID,
    new DiscordRoleManager(client, GUILD_ID as Snowflake),
    output
  )
);
roleProxy(client, roleRunner);

client.once('ready', () => {
  readyLog(client);
});

client.login(token).catch(console.error);
