import { generateDependencyReport } from '@discordjs/voice';
import { Client, GatewayIntentBits, REST, Routes, version } from 'discord.js';
import dotenv from 'dotenv';
import { join } from 'node:path';

import { schemaToDiscordFormat } from '../adaptor/command-schema.js';
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
  VoiceRoomProxy,
  middlewareForMessage,
  middlewareForUpdateMessage,
  roleProxy
} from '../adaptor/index.js';
import { DiscordCommandProxy } from '../adaptor/proxy/command.js';
import { loadSchedule } from '../adaptor/signal-schedule.js';
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
  GUILD_ID,
  PREFIX,
  FEATURE,
  APPLICATION_ID
} = extractEnv(
  [
    'DISCORD_TOKEN',
    'MAIN_CHANNEL_ID',
    'GUILD_ID',
    'PREFIX',
    'FEATURE',
    'APPLICATION_ID'
  ],
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
const output = new DiscordOutput(client, mainChannelId);

const scheduleRunner = new ScheduleRunner(clock);
const messageCreateRunner = new MessageResponseRunner(
  new MessageProxy(client, middlewareForMessage())
);
if (features.includes('MESSAGE_CREATE')) {
  messageCreateRunner.addResponder(
    allMessageEventResponder(typoRepo, sequencesYaml)
  );

  startTimeSignal({
    runner: scheduleRunner,
    clock,
    schedule: loadSchedule(['assets', 'time-signal.yaml']),
    output
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

const rest = new REST().setToken(token);
if (features.includes('SLASH_COMMAND')) {
  const currentRegistered = (await rest.get(
    Routes.applicationGuildCommands(APPLICATION_ID, GUILD_ID)
  )) as unknown[];
  const currentRegisteredByName = new Map(
    (
      currentRegistered as {
        name: string;
        id: string;
        [key: string]: unknown;
      }[]
    ).map((obj) => [obj.name, obj])
  );
  const commands = commandRunner
    .getResponders()
    .flatMap((responder) => schemaToDiscordFormat(responder.schema));
  const commandNames = new Map(
    (commands as { name: string }[]).map((obj) => [obj.name, obj])
  );

  const idsNeedToDelete = [...currentRegisteredByName.keys()]
    .filter((name) => !commandNames.has(name))
    .map((name) => currentRegisteredByName.get(name)?.id ?? 'unknown');
  const needToUpdate = [...currentRegisteredByName.values()].filter(
    (registered) =>
      JSON.stringify(commandNames.get(registered.name) ?? {}) !==
      JSON.stringify(registered)
  );
  const needToRegister = (
    commands as { name: string; [key: string]: unknown }[]
  ).filter(({ name }) => !currentRegisteredByName.has(name));

  try {
    if (0 < idsNeedToDelete.length) {
      console.log('コマンドの削除を開始…');
      for (let i = 0; i < idsNeedToDelete.length; ++i) {
        console.log(`${i + 1}/${idsNeedToDelete.length}`);
        await rest.delete(
          Routes.applicationGuildCommand(
            APPLICATION_ID,
            GUILD_ID,
            idsNeedToDelete[i]
          )
        );
      }
    }

    if (0 < needToUpdate.length) {
      console.log('コマンドの更新を開始…');
      for (let i = 0; i < needToUpdate.length; ++i) {
        console.log(`${i + 1}/${needToUpdate.length}`);
        await rest.patch(
          Routes.applicationGuildCommand(
            APPLICATION_ID,
            GUILD_ID,
            needToUpdate[i].id
          ),
          {
            body: needToUpdate[i]
          }
        );
      }
    }

    if (0 < needToRegister.length) {
      console.log('コマンドの追加を開始…');
      for (let i = 0; i < needToRegister.length; ++i) {
        console.log(`${i + 1}/${needToUpdate.length}`);
        await rest.post(
          Routes.applicationGuildCommands(APPLICATION_ID, GUILD_ID),
          {
            body: needToRegister[i]
          }
        );
      }
    }
    console.log('コマンドの登録に成功しました。');
  } catch (error) {
    console.error(error);
  }
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
  void client.destroy();
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
