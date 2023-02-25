import { join } from 'node:path';

import { generateDependencyReport } from '@discordjs/voice';
import { Client, GatewayIntentBits, version } from 'discord.js';
import dotenv from 'dotenv';

import { DiscordChannelRepository } from '../adaptor/discord/channel.js';
import { DiscordMemberStats } from '../adaptor/discord/member-stats.js';
import { DiscordMessageRepository } from '../adaptor/discord/message-repo.js';
import { DiscordRoleManager } from '../adaptor/discord/role.js';
import { DiscordSheriff } from '../adaptor/discord/sheriff.js';
import { DiscordWS } from '../adaptor/discord/ws.js';
import { loadEmojiSeqYaml } from '../adaptor/emoji-seq-loader.js';
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
  middlewareForMessage,
  middlewareForUpdateMessage,
  roleProxy,
  VoiceRoomProxy
} from '../adaptor/index.js';
import { DiscordCommandProxy } from '../adaptor/proxy/command.js';
import { GenVersionFetcher } from '../adaptor/version/fetch.js';
import type { Snowflake } from '../model/id.js';
import { CommandRunner } from '../runner/command.js';
import {
  EmojiResponseRunner,
  MessageResponseRunner,
  MessageUpdateResponseRunner,
  RoleResponseRunner,
  ScheduleRunner,
  VoiceRoomResponseRunner
} from '../runner/index.js';
import type { GyokuonAssetKey } from '../service/command/gyokuon.js';
import type { KaereMusicKey } from '../service/command/kaere.js';
import type { AssetKey } from '../service/command/party.js';
import {
  allEmojiResponder,
  allMessageEventResponder,
  allMessageUpdateEventResponder,
  allRoleResponder,
  registerAllCommandResponder
} from '../service/index.js';
import {
  type VoiceChannelParticipant,
  VoiceDiff
} from '../service/voice-diff.js';
import { extractEnv } from './extract-env.js';

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
  GatewayIntentBits.Guilds, // GUILD_CREATE による初期化
  GatewayIntentBits.GuildMessages, // ほとんどのメッセージに反応する機能
  GatewayIntentBits.GuildMessageReactions, // タイマー削除をリアクションでキャンセルする機能
  GatewayIntentBits.GuildVoiceStates, // VoiceDiff 機能
  GatewayIntentBits.GuildEmojisAndStickers // EmojiLog機能
];

const client = new Client({ intents });

const typoRepo = new InMemoryTypoRepository();
const reservationRepo = new InMemoryReservationRepository();
const clock = new ActualClock();
const sequencesYaml = loadEmojiSeqYaml(['assets', 'emoji-seq.yaml']);

const messageCreateRunner = new MessageResponseRunner(
  new MessageProxy(client, middlewareForMessage())
);
if (features.includes('MESSAGE_CREATE')) {
  messageCreateRunner.addResponder(
    allMessageEventResponder(typoRepo, sequencesYaml)
  );
}

const messageUpdateRunner = new MessageUpdateResponseRunner(
  new MessageUpdateProxy(client, middlewareForUpdateMessage())
);
if (features.includes('MESSAGE_UPDATE')) {
  messageUpdateRunner.addResponder(allMessageUpdateEventResponder());
}

const scheduleRunner = new ScheduleRunner(clock);

const commandProxy = new DiscordCommandProxy(client, PREFIX);
const commandRunner = new CommandRunner(commandProxy);
const stats = new DiscordMemberStats(client, GUILD_ID as Snowflake);
const output = new DiscordOutput(client, mainChannelId);

// ほとんど変わらないことが予想され環境変数で管理する必要性が薄いので、ハードコードした。
const KAWAEMON_ID = '391857452360007680' as Snowflake;
const roleManager = new DiscordRoleManager(client, GUILD_ID as Snowflake);

const channelRepository = new DiscordChannelRepository(
  client,
  GUILD_ID as Snowflake
);

if (features.includes('COMMAND')) {
  registerAllCommandResponder({
    typoRepo,
    reservationRepo,
    factory: new DiscordVoiceConnectionFactory<
      AssetKey | KaereMusicKey | GyokuonAssetKey
    >(client, {
      COFFIN_INTRO: join('assets', 'party', 'coffin-intro.mp3'),
      COFFIN_DROP: join('assets', 'party', 'coffin-drop.mp3'),
      KAKAPO: join('assets', 'party', 'kakapo.mp3'),
      KAKUSIN_DAISUKE: join('assets', 'party', 'kakusin-daisuke.mp3'),
      POTATO: join('assets', 'party', 'potato.mp3'),
      NEROYO: join('assets', 'kaere', 'neroyo.mp3'),
      GYOKUON: join('assets', 'gyokuon', 'gyokuon.mp3')
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
    membersRepo: stats,
    roleRepo: roleManager,
    userRepo: stats,
    guildRepo: stats,
    roleCreateRepo: roleManager,
    queen: new MathRandomGenerator(),
    stdout: output,
    channelRepository
  });
}

const provider = new VoiceRoomProxy<VoiceChannelParticipant>(
  client,
  (voiceState) => new DiscordParticipant(voiceState)
);
const voiceRoomRunner = new VoiceRoomResponseRunner(provider);
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

// PID 1 問題のためのシグナルハンドラ
process.on('SIGTERM', () => {
  client.destroy();
  process.exit(0);
});

client.once('ready', () => {
  const projectVersion = process.env.npm_package_version;
  const connectionUser = client.user;
  if (connectionUser == null) return;
  if (projectVersion !== undefined) {
    connectionUser.setActivity(`v${projectVersion}`);
  }
  console.log('======================================');
  console.log('起動しました。');
  console.log(`ログインユーザー: ${connectionUser.tag}(${connectionUser.id})`);
  console.log(`バージョン:`);
  console.log(` - ビルド: v${projectVersion ?? 'unknown'}`);
  console.log(` - discord.js: v${version}`);
  console.log(` - Node.js: ${process.version}`);
  console.log('コンフィグ:');
  console.log(` - 有効化済み機能: ${FEATURE}`);
  console.log(` - プレフィックス: ${PREFIX}`);
  console.log(` - メインチャンネルID: ${mainChannelId}`);
  console.log(` - ギルドID: ${GUILD_ID}`);
  console.log(generateDependencyReport());
  console.log('======================================');
});

client.login(token).catch(console.error);
