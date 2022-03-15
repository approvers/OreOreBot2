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
import {
  MessageResponseRunner,
  MessageUpdateResponseRunner,
  ScheduleRunner,
  VoiceRoomResponseRunner
} from '../runner';
import { type VoiceChannelParticipant, VoiceDiff } from '../service/voice-diff';
import {
  allCommandResponder,
  allMessageEventResponder,
  allMessageUpdateEventResponder
} from '../service';
import type { AssetKey } from '../service/party';
import type { KaereMusicKey } from '../service/kaere';
import dotenv from 'dotenv';
import { generateDependencyReport } from '@discordjs/voice';
import { join } from 'path';

dotenv.config();
const token = process.env.DISCORD_TOKEN;
const mainChannelId = process.env.MAIN_CHANNEL_ID;
if (!token || !mainChannelId) {
  throw new Error(
    'Error> Failed to start. You did not specify any environment variables.'
  );
}

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

const commandRunner = new MessageResponseRunner(
  new MessageProxy(client, transformerForCommand('!'))
);
commandRunner.addResponder(
  allCommandResponder(
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
    new DiscordVoiceRoomController(client)
  )
);

const provider = new VoiceRoomProxy<VoiceChannelParticipant>(
  client,
  (voiceState) => new DiscordParticipant(voiceState)
);
const voiceRunner = new VoiceRoomResponseRunner(provider);
voiceRunner.addResponder(
  new VoiceDiff(new DiscordOutput(client, mainChannelId))
);

client.once('ready', () => {
  readyLog(client);
});

client.login(token).catch(console.error);
