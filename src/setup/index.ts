/**
 * Slash (/) Command登録処理
 * りにあさんのキミフィール参考
 */
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import * as dotenv from 'dotenv';

import commands from './commands.json';

dotenv.config();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
if (!token || !clientId || !guildId) {
  throw new Error('環境変数が指定されてないよ。殺すよ？');
}
const rest = new REST({ version: '9' }).setToken(token);

function getCommands(): object[] {
  return [commands];
}

void (async () => {
  try {
    console.log('Slash (/) Commandの登録を開始するよ');

    await rest.put(Routes.applicationCommands(clientId), {
      body: getCommands()
    });
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: []
    });

    console.log('Slash (/) Commandの登録が完了したよ');
  } catch (e) {
    console.error(
      'Slash (/) Commandの登録に失敗したよ。エラーの詳細はコンソールを確認してね。'
    );
    console.error(JSON.stringify(e));
  }
})();
