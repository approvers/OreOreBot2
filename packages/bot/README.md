# `@oreorebot2/bot`

Discord Bot 本体を提供するパッケージ。

## 必要動作環境

以下のものをインストールしていることを想定しています。

- git
- ffmpeg
- Node.js v18.x 以上
- yarn v3

## 環境変数

デフォルト値が無い変数は指定する必要があり、指定しなかった場合は起動に失敗します。

起動時にデフォルト値が存在する変数の値が指定されていない場合は、そのデフォルト値が使われます。

| 変数名            | 説明                                                                                                                                                                           | 必須  |
| ----------------- |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| ----- |
| `DISCORD_TOKEN`   | BOT のトークン                                                                                                                                                                    | True  |
| `MAIN_CHANNEL_ID` | VoiceDiff(VC 入退室ログ)を送信する **テキスト** チャンネルの ID                                                                                                                                  | True  |
| `APPLICATION_ID`  | BOT のアプリケーション ID                                                                                                                                                             | True  |
| `GUILD_ID`        | 限界開発鯖の ID                                                                                                                                                                    | True  |
| `PREFIX`          | コマンドの接頭辞、デフォルト値は `"!"`                                                                                                                                                       | False |
| `FEATURE`         | 有効にする機能のカンマ区切り文字列、デフォルト値はスラッシュコマンドを除く全ての機能。`"MESSAGE_CREATE"`, `"MESSAGE_UPDATE"`, `"COMMAND"`, `"VOICE_ROOM"`, `"ROLE"`, `"EMOJI"`, `"SLASH_COMMAND"`, `"MEMBER"` を組み合わせ可能。 | False |

## インストール

### Yarn を使用する場合

```shell
git clone https://github.com/approvers/OreOreBot2.git
cd OreOreBot2
corepack enable yarn
yarn install
yarn build:bot
yarn start
```

`yarn start` での起動時に上記の環境変数を指定してください。`.env` でも指定できます。

`yarn dev:bot` を使用することでコンパイルせずに起動することもできます。

### Docker を使用する場合

Docker・Docker Compose が利用可能であるとします。

```shell
git clone https://github.com/approvers/OreOreBot2.git
cd OreOreBot2
docker compose up -d
```

`.env` で環境変数を設定してから `docker compose up -d` を実行してください。
