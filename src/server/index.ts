import { Client, version } from 'discord.js';
import { MessageProxy, observableMessage } from '../adaptor';
import { MessageResponseRunner } from '../runner';
import { DeletionRepeater } from '../service';
import dotenv from 'dotenv';

dotenv.config();
const token = process.env.DISCORD_TOKEN;
if (!token) {
  throw new Error(
    'Error> Failed to start. You did not specify any environment variables.'
  );
}

const client = new Client({
  intents: [0]
});

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

client.login(token).catch(console.error);

const proxy = new MessageProxy(client, observableMessage);
const runner = new MessageResponseRunner(proxy);
runner.addResponder(new DeletionRepeater());

client.once('ready', () => {
  readyLog(client);
});
