# OreOreBot2 (新生はらちょ)

限界開発鯖を代表するBOT [はらちょ](https://github.com/approvers/OreOreBot) を TypeScript+discord.js で作り直し。

オレオレBOTです。別に詐欺とかはしません。

## はらちょとは？

**限界開発鯖民の活動を支えようとしてるBOTです**

- はらちょは 2020/03/03 に限界開発鯖に接続されたBOTです。
    - おそらく限界開発鯖に接続された初めてのBOTです。
    - Python+discord.pyで構築されたBOTで、当初は [いっそう](https://github.com/isso0424), [こるく](https://github.com/Colk-tech), [フライさん](https://github.com/loxygenK) で開発され、後に [かわえもん](https://github.com/kawaemon) , [そうし](https://github.com/soshiharami), [ko](https://github.com/ko50) (敬称略) が参加し開発されました。
- はらちょは非常に厄介な仕組みなどがされており、 2021年に入ったあとは、開発が行われることはありませんでした。(アップデートなどの小さなものはあった)
- Goでの再実装も計画されましたが、結局完了することはなく、永久凍結することになります。
- 2021/12/19, discord.pyの開発停止やDiscord API v6, v7の廃止による **はらちょのGateway API切断問題(2022年問題)(クソデカ主語)** を解決すべく、新生はらちょが作られることになりました。
    - [初代はらちょぶっ殺しプロジェクト](https://github.com/approvers/OreOreBot2/milestone/1) の開始です。
    - これもGoと同じく、途中で永久凍結するところでしたが、 [雪](https://github.com/YukiYuigishi) ~~容疑者~~ が初代はらちょを殺した罪で死刑が確定したことで、作り直しが加速することになり、 2022/02/27 ついに最初の [初代はらちょぶっ殺しプロジェクト](https://github.com/approvers/OreOreBot2/milestone/1) が終了しました。

## 環境構築

```shell
git clone https://github.com/approvers/OreOreBot2.git
yarn compile
yarn start
```
(`.env` で環境変数を指定してください。)

## 環境変数

| 変数名               | 説明                                                         |
|-------------------|------------------------------------------------------------|
| `DISCORD_TOKEN`   | BOTのトークン                                                   |
| `MAIN_CHANNEL_ID` | VoiceDiff(VC入退室ログ)を送信するチャンネルのID (⚠: テキストチャンネルである必要があります。 ) |
