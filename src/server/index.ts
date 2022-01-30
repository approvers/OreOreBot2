import { Client, Intents, version } from 'discord.js';
import { MessageProxy, observableMessage } from '../adaptor';
import { MessageResponseRunner, MessageUpdateResponseRunner } from '../runner';
import {
  allMessageEventResponder,
  allMessageUpdateEventResponder
} from '../service';
import dotenv from 'dotenv';

dotenv.config();
const token = process.env.DISCORD_TOKEN;
if (!token) {
  throw new Error(
    'Error> Failed to start. You did not specify any environment variables.'
  );
}

const intents = new Intents();
intents.add(Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES);

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
  console.info('============');
}

const proxy = new MessageProxy(client, observableMessage);
const runner = new MessageResponseRunner(proxy);
runner.addResponder(allMessageEventResponder());
const updateRunner = new MessageUpdateResponseRunner(proxy);
updateRunner.addResponder(allMessageUpdateEventResponder());

client.once('ready', () => {
  readyLog(client);
});

client.login(token).catch(console.error);
