import { generateDependencyReport } from '@discordjs/voice';
import * as Sentry from '@sentry/node';
import { Client, GatewayIntentBits, REST, Routes, version } from 'discord.js';
import dotenv from 'dotenv';
import { join } from 'node:path';

import { DiscordChannelRepository } from '../adaptor/discord/channel.js';
import { DiscordCommandRepository } from '../adaptor/discord/command-repo.js';
import { DiscordMemberStats } from '../adaptor/discord/member-stats.js';
import { DiscordMessageRepository } from '../adaptor/discord/message-repo.js';
import { DiscordRoleManager } from '../adaptor/discord/role.js';
import { DiscordSheriff } from '../adaptor/discord/sheriff.js';
import { DiscordWS } from '../adaptor/discord/ws.js';
import { loadEmojiSeqYaml } from '../adaptor/emoji-seq-loader.js';
import {
  ActualClock,
  DiscordStandardOutput,
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
  middlewareForMessage,
  middlewareForUpdateMessage,
  roleProxy,
  DiscordEntranceOutput
} from '../adaptor/index.js';
import { DiscordCommandProxy } from '../adaptor/proxy/command.js';
import { memberProxy } from '../adaptor/proxy/member.js';
import { StickerProxy } from '../adaptor/proxy/sticker.js';
import { loadSchedule } from '../adaptor/signal-schedule.js';
import { GenVersionFetcher } from '../adaptor/version/fetch.js';
import { DepRegistry } from '../driver/dep-registry.js';
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
import { MemberResponseRunner } from '../runner/member.js';
import { StickerResponseRunner } from '../runner/sticker.js';
import type { GyokuonAssetKey } from '../service/command/gyokuon.js';
import type { KaereMusicKey } from '../service/command/kaere.js';
import { memberStatsKey } from '../service/command/kokusei-chousa.js';
import type { AssetKey } from '../service/command/party.js';
import { registerCommands } from '../service/command/register.js';
import {
  allEmojiResponder,
  allMemberResponder,
  allMessageEventResponder,
  allMessageUpdateEventResponder,
  allRoleResponder,
  allStickerResponder,
  registerAllCommandResponder
} from '../service/index.js';
import { startTimeSignal } from '../service/time-signal.js';
import {
  type VoiceChannelParticipant,
  VoiceDiff
} from '../service/voice-diff.js';
import { extractEnv } from './extract-env.js';

dotenv.config();
const {
  DISCORD_TOKEN: token,
  MAIN_CHANNEL_ID: mainChannelId,
  ENTRANCE_CHANNEL_ID: entranceChannelId,
  GUILD_ID,
  PREFIX,
  FEATURE,
  APPLICATION_ID
} = extractEnv(
  [
    'DISCORD_TOKEN',
    'MAIN_CHANNEL_ID',
    'ENTRANCE_CHANNEL_ID',
    'GUILD_ID',
    'PREFIX',
    'FEATURE',
    'APPLICATION_ID'
  ],
  {
    PREFIX: '!',
    FEATURE:
      'MESSAGE_CREATE,MESSAGE_UPDATE,COMMAND,VOICE_ROOM,ROLE,EMOJI,MEMBER'
  }
);

const features = FEATURE.split(',');

const intents = [
  GatewayIntentBits.Guilds, // GUILD_CREATE による初期化
  GatewayIntentBits.GuildMembers, // メンバーの参加を検知する機能
  GatewayIntentBits.GuildMessages, // ほとんどのメッセージに反応する機能
  GatewayIntentBits.GuildMessageReactions, // タイマー削除をリアクションでキャンセルする機能
  GatewayIntentBits.GuildVoiceStates, // VoiceDiff 機能
  GatewayIntentBits.GuildEmojisAndStickers // EmojiLog機能
];

const client = new Client({ intents });

Sentry.init({
  dsn: 'https://55c3207ddee962e0fae247233a3f6404@sentry.approvers.dev/3'
});

const typoRepo = new InMemoryTypoRepository();
const reservationRepo = new InMemoryReservationRepository();
const clock = new ActualClock();
const sequencesYaml = loadEmojiSeqYaml(['assets', 'emoji-seq.yaml']);
const standardOutput = new DiscordStandardOutput(client, mainChannelId);
const entranceOutput = new DiscordEntranceOutput(client, entranceChannelId);

const scheduleRunner = new ScheduleRunner(clock);
const getCurrentDate = () => new Date();
const messageCreateRunner = new MessageResponseRunner(
  new MessageProxy(client, middlewareForMessage())
);
if (features.includes('MESSAGE_CREATE')) {
  messageCreateRunner.addResponder(
    allMessageEventResponder(typoRepo, sequencesYaml, getCurrentDate)
  );

  startTimeSignal({
    runner: scheduleRunner,
    clock,
    schedule: loadSchedule(['assets', 'time-signal.yaml']),
    output: standardOutput
  });
}

const messageUpdateRunner = new MessageUpdateResponseRunner(
  new MessageUpdateProxy(client, middlewareForUpdateMessage())
);
if (features.includes('MESSAGE_UPDATE')) {
  messageUpdateRunner.addResponder(allMessageUpdateEventResponder());
}

const commandProxy = new DiscordCommandProxy(client, PREFIX);
const commandRunner = new CommandRunner(commandProxy);
const stats = new DiscordMemberStats(client, GUILD_ID as Snowflake);

// ほとんど変わらないことが予想され環境変数で管理する必要性が薄いので、ハードコードした。
const KAWAEMON_ID = '391857452360007680' as Snowflake;
const roleManager = new DiscordRoleManager(client, GUILD_ID as Snowflake);

const channelRepository = new DiscordChannelRepository(
  client,
  GUILD_ID as Snowflake
);
const versionFetcher = new GenVersionFetcher();

const registry = new DepRegistry();
registry.add(memberStatsKey, stats);

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
      GYOKUON: join('assets', 'gyokuon', 'gyokuon.mp3'),
      GYOKUON_SHORT: join('assets', 'gyokuon', 'gyokuon-short.mp3')
    }),
    clock,
    scheduleRunner,
    random: new MathRandomGenerator(),
    roomController: new DiscordVoiceRoomController(client),
    commandRunner,
    registry,
    sheriff: new DiscordSheriff(client),
    ping: new DiscordWS(client),
    fetcher: versionFetcher,
    messageRepo: new DiscordMessageRepository(client),
    membersRepo: stats,
    roleRepo: roleManager,
    userRepo: stats,
    guildRepo: stats,
    roleCreateRepo: roleManager,
    queen: new MathRandomGenerator(),
    stdout: standardOutput,
    channelRepository
  });
}

const rest = new REST().setToken(token);
if (features.includes('SLASH_COMMAND')) {
  const commandRepo = new DiscordCommandRepository(
    rest,
    APPLICATION_ID,
    GUILD_ID
  );
  await registerCommands({ commandRepo, commandRunner });
} else {
  try {
    await rest.put(Routes.applicationGuildCommands(APPLICATION_ID, GUILD_ID), {
      body: []
    });
    console.log('コマンドの削除に成功しました。');
  } catch (error) {
    console.error(error);
  }
}

const provider = new VoiceRoomProxy<VoiceChannelParticipant>(
  client,
  (voiceState) => new DiscordParticipant(voiceState)
);
const voiceRoomRunner = new VoiceRoomResponseRunner(provider);
if (features.includes('VOICE_ROOM')) {
  voiceRoomRunner.addResponder(new VoiceDiff(standardOutput));
}

const roleRunner = new RoleResponseRunner();
if (features.includes('ROLE')) {
  roleRunner.addResponder(
    allRoleResponder({
      kawaemonId: KAWAEMON_ID,
      roleManager,
      output: standardOutput
    })
  );
  roleProxy(client, roleRunner);
}

const emojiRunner = new EmojiResponseRunner(new EmojiProxy(client));
if (features.includes('EMOJI')) {
  emojiRunner.addResponder(allEmojiResponder(standardOutput));
}

const stickerRunner = new StickerResponseRunner(new StickerProxy(client));
if (features.includes('STICKER')) {
  stickerRunner.addResponder(allStickerResponder(standardOutput));
}

const memberRunner = new MemberResponseRunner();
if (features.includes('MEMBER')) {
  memberRunner.addResponder(allMemberResponder(entranceOutput));
  memberProxy(client, memberRunner);
}

// PID 1 問題のためのシグナルハンドラ
process.on('SIGTERM', () => {
  void client.destroy();
  process.exit(0);
});

client.once('ready', () => {
  const projectVersion = versionFetcher.version;
  const connectionUser = client.user;
  if (connectionUser == null) return;
  console.log('======================================');
  console.log('起動しました。');
  console.log(`ログインユーザー: ${connectionUser.tag}(${connectionUser.id})`);
  console.log(`バージョン:`);
  console.log(` - ビルド: v${projectVersion}`);
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
