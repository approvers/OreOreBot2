import { Client, version } from 'discord.js';
import dotenv from 'dotenv';
import { DiscordParticipant, VoiceRoomProxy } from '../adaptor';
import { VoiceRoomResponseRunner } from '../runner';
import { VoiceChannelParticipant, VoiceDiff } from './service/VoiceDiff';

dotenv.config();
const token = process.env.DISCORD_TOKEN;
const mainChannelId = process.env.MAIN_CHANNEL_ID;
if (!token || !mainChannelId) {
  throw new Error(
    'Error> Failed to start. You did not specify any environment variables.'
  );
}

const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES']
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

client.once('ready', async () => {
  readyLog(client);
  const mainChannel = await client.channels.fetch(mainChannelId);
  if (!mainChannel || !mainChannel.isText()) {
    throw new Error('メインのチャンネルが見つかりません。');
  }
  const provider = new VoiceRoomProxy<VoiceChannelParticipant>(
    client,
    (voicestate) => new DiscordParticipant(voicestate, mainChannel)
  );
  const runner = new VoiceRoomResponseRunner(provider);
  runner.addResponder(new VoiceDiff());
});
