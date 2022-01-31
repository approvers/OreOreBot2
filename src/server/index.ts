import { Client, Intents, version } from 'discord.js';
import {
  ActualClock,
  InMemoryTypoRepository,
  MessageProxy,
  MessageUpdateProxy,
  converterWithPrefix,
  observableLifter,
  observableMessage
} from '../adaptor';
import {
  MessageResponseRunner,
  MessageUpdateResponseRunner,
  ScheduleRunner
} from '../runner';
import {
  allCommandResponder,
  allMessageEventResponder,
  allMessageUpdateEventResponder
} from '../service';
import dotenv from 'dotenv';
import { generateDependencyReport } from '@discordjs/voice';

dotenv.config();
const token = process.env.DISCORD_TOKEN;
if (!token) {
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
const clock = new ActualClock();

const runner = new MessageResponseRunner(
  new MessageProxy(client, observableLifter)
);
runner.addResponder(allMessageEventResponder(typoRepo));

const updateRunner = new MessageUpdateResponseRunner(
  new MessageUpdateProxy(client, observableMessage)
);
updateRunner.addResponder(allMessageUpdateEventResponder());

const scheduleRunner = new ScheduleRunner(clock);

const commandRunner = new MessageResponseRunner(
  new MessageProxy(client, converterWithPrefix('!'))
);
commandRunner.addResponder(
  allCommandResponder(typoRepo, clock, scheduleRunner)
);

client.once('ready', () => {
  readyLog(client);
});

client.login(token).catch(console.error);
