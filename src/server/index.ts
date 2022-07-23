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
import { EmojiProxy } from '../adaptor/emoji-proxy.js';
import { GenVersionFetcher } from '../adaptor/version/fetch.js';
import type { KaereMusicKey } from '../service/command/kaere.js';
import { Snowflake } from '../model/id.js';
import dotenv from 'dotenv';
import { extractEnv } from './extract-env.js';
import { generateDependencyReport } from '@discordjs/voice';
import { join } from 'node:path';
import { loadEmojiSeqYaml } from '../adaptor/emoji-seq-loader.js';
import { roleProxy } from '../adaptor/role-proxy.js';

dotenv.config();
const {
  DISCORD_TOKEN: token,
  MAIN_CHANNEL_ID: mainChannelId,
  GUILD_ID
} = extractEnv(['DISCORD_TOKEN', 'MAIN_CHANNEL_ID', 'GUILD_ID']);

const intents = [
  GatewayIntentBits.Guilds, // GUILD_CREATE による初期化
  GatewayIntentBits.GuildMessages, // ほとんどのメッセージに反応する機能
  GatewayIntentBits.GuildVoiceStates, // VoiceDiff 機能
  GatewayIntentBits.GuildEmojisAndStickers // EmojiLog機能
];

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
const sequencesYaml = loadEmojiSeqYaml(['assets', 'emoji-seq.yaml']);

const runner = new MessageResponseRunner(
  new MessageProxy(client, transformerForMessage())
);
runner.addResponder(allMessageEventResponder(typoRepo, sequencesYaml));

const updateRunner = new MessageUpdateResponseRunner(
  new MessageUpdateProxy(client, transformerForUpdateMessage())
);
updateRunner.addResponder(allMessageUpdateEventResponder());

const scheduleRunner = new ScheduleRunner(clock);

const commandRunner: MessageResponseRunner<CommandMessage, CommandResponder> =
  new MessageResponseRunner(
    new MessageProxy(client, transformerForCommand('!'))
  );
const stats = new DiscordMemberStats(client, GUILD_ID as Snowflake);
registerAllCommandResponder({
  typoRepo,
  reservationRepo,
  factory: new DiscordVoiceConnectionFactory<AssetKey | KaereMusicKey>(client, {
    COFFIN_INTRO: join('assets', 'party', 'coffin-intro.mp3'),
    COFFIN_DROP: join('assets', 'party', 'coffin-drop.mp3'),
    KAKAPO: join('assets', 'party', 'kakapo.mp3'),
    KAKUSIN_DAISUKE: join('assets', 'party', 'kakusin-daisuke.mp3'),
    NEROYO: join('assets', 'kaere', 'neroyo.mp3')
  }),
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
  membersRepo: stats
});

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
  allRoleResponder({
    kawaemonId: KAWAEMON_ID,
    roleManager: new DiscordRoleManager(client, GUILD_ID as Snowflake),
    output
  })
);
roleProxy(client, roleRunner);

const emojiRunner = new EmojiResponseRunner(new EmojiProxy(client));
emojiRunner.addResponder(allEmojiResponder(output));

client.once('ready', () => {
  readyLog(client);
});

client.login(token).catch(console.error);
