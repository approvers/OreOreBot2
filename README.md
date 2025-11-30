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

## パッケージ構造

OreOreBot2 は以下のパッケージ構成で運用されています。

- `@oreorebot2/common`: スクリプトや共通の依存関係を提供するパッケージです。
- [`@oreorebot2/bot`](./packages/bot/README.md): Discord Bot 本体を提供するパッケージです。
- [`@oreorebot2/docs`](./packages/docs/README.md): OreOreBot2 のドキュメントを提供するパッケージです。

## 機能の追加・改善

機能の追加や改善などがありましたら [Issue](https://github.com/approvers/OreOreBot2/issues/new) から新規 Issue を作成してください。

もちろん [自分で作成して PR を送ってくれても、いいんですよ (ちらっ)](.github/CONTRIBUTING.md)

限界開発鯖だし、はらちょなので、どんなふざけた機能でも大歓迎です。

## 貢献

はらちょの開発への参加は大歓迎です!

貢献に関する規定などは [CONTRIBUTING.md](.github/CONTRIBUTING.md) をご覧ください。

開発に関する質問は **限界開発鯖内 プロジェクトチャンネル [`#新生はらちょ`](https://discordapp.com/channels/683939861539192860/947208529561927710)
または [Discussions](https://github.com/approvers/OreOreBot2/discussions)** までどうぞ。
