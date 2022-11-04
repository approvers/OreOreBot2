# OreOreBot2 (新生はらちょ)

[![Release](https://github.com/approvers/OreOreBot2/actions/workflows/release.yml/badge.svg)](https://github.com/approvers/OreOreBot2/actions/workflows/release.yml)
[![run codeql analysis](https://github.com/approvers/OreOreBot2/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/approvers/OreOreBot2/actions/workflows/codeql-analysis.yml)
[![run eslint](https://github.com/approvers/OreOreBot2/actions/workflows/eslint.yml/badge.svg)](https://github.com/approvers/OreOreBot2/actions/workflows/eslint.yml)
[![run test](https://github.com/approvers/OreOreBot2/actions/workflows/test.yml/badge.svg)](https://github.com/approvers/OreOreBot2/actions/workflows/test.yml)
[![run prettier](https://github.com/approvers/OreOreBot2/actions/workflows/prettier.yml/badge.svg)](https://github.com/approvers/OreOreBot2/actions/workflows/prettier.yml)
[![codecov](https://codecov.io/gh/approvers/OreOreBot2/branch/main/graph/badge.svg?token=YVDPQFTLZK)](https://codecov.io/gh/approvers/OreOreBot2)

---

限界開発鯖を代表する BOT [はらちょ](https://github.com/approvers/OreOreBot) を TypeScript+discord.js で作り直し。

オレオレ BOT です。別に詐欺とかはしません。

## はらちょとは？

**限界開発鯖民の活動を支えようとしてる BOT です**

- はらちょは 2020/03/03 に限界開発鯖に接続された BOT です。
  - おそらく限界開発鯖に接続された初めての BOT です。
  - Python+discord.py で構築された BOT で、当初は [いっそう](https://github.com/isso0424), [こるく](https://github.com/Colk-tech), [フライさん](https://github.com/loxygenK) で開発され、後に [かわえもん](https://github.com/kawaemon) , [そうし](https://github.com/soshiharami), [ko](https://github.com/ko50) (敬称略) が参加し開発されました。
- はらちょは非常に厄介な仕組みなどがされており、 2021 年に入ったあとは、開発が行われることはありませんでした。(アップデートなどの小さなものはあった)
- Go での再実装も計画されましたが、結局完了することはなく、永久凍結することになります。
- 2021/12/19, discord.py の開発停止や Discord API v6, v7 の廃止による **はらちょの Gateway API 切断問題(2022 年問題)(クソデカ主語)** を解決すべく、新生はらちょが作られることになりました。
  - [初代はらちょぶっ殺しプロジェクト](https://github.com/approvers/OreOreBot2/milestone/1) の開始です。
  - これも Go と同じく、途中で永久凍結するところでしたが、 [雪](https://github.com/YukiYuigishi) が初代はらちょを殺した罪で死刑が確定したことで、作り直しが加速することになり、 2022/02/27 ついに最初の [初代はらちょぶっ殺しプロジェクト](https://github.com/approvers/OreOreBot2/milestone/1) が終了しました。

## 機能の追加・改善

機能の追加や改善などがありましたら [Issue](https://github.com/approvers/OreOreBot2/issues/new) から新規 Issue を作成してください。

もちろん [自分で作成して PR を送ってくれても、いいんですよ (ちらっ)](.github/CONTRIBUTING.md)

限界開発鯖だし、はらちょなので、どんなふざけた機能でも大歓迎です。

## 貢献

はらちょの開発への参加は大歓迎です!

貢献に関する規定などは [CONTRIBUTING.md](.github/CONTRIBUTING.md) をご覧ください。

開発に関する質問は **限界開発鯖内 プロジェクトチャンネル [`#新生はらちょ`](https://discordapp.com/channels/683939861539192860/947208529561927710)
または [Discussions](https://github.com/approvers/OreOreBot2/discussions)** までどうぞ。

### OreOreBot2 Discussion

OreOreBot2 の [Discussions](https://github.com/approvers/OreOreBot2/discussions) では開発の議論などを行っています。

- [Discussion の使い方](https://github.com/approvers/OreOreBot2/discussions/147)

## 使用方法

### 事前要件

以下のものをインストールしていることを想定しています。

- git
- ffmpeg
- node.js
- yarn

### 環境変数

デフォルト値が無い変数は指定する必要があり、指定しなかった場合は起動に失敗します。

起動時にデフォルト値が存在する変数の値が指定されていない場合は、そのデフォルト値が使われます。

| 変数名            | 説明                                                                                                                                                                      | 必須  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| `DISCORD_TOKEN`   | BOT のトークン                                                                                                                                                            | True  |
| `MAIN_CHANNEL_ID` | VoiceDiff(VC 入退室ログ)を送信する **テキスト** チャンネルの ID                                                                                                           | True  |
| `GUILD_ID`        | 限界開発鯖の ID                                                                                                                                                           | True  |
| `PREFIX`          | コマンドの接頭辞、デフォルト値は `"!"`                                                                                                                                    | False |
| `FEATURE`         | 有効にする機能のカンマ区切り文字列、デフォルト値は全ての機能。`"MESSAGE_CREATE"`, `"MESSAGE_UPDATE"`, `"COMMAND"`, `"VOICE_ROOM"`, `"ROLE"`, `"EMOJI"` を組み合わせ可能。 | False |

### インストールと実行

```shell
git clone https://github.com/approvers/OreOreBot2.git
yarn build
yarn start
```

`yarn start` での起動時に上記の環境変数を指定してください。`.env` でも指定できます。

`yarn dev` を使用することでコンパイルせずに起動することもできます。
