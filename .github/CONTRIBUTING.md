# OreOreBot2 への貢献

OreOreBot2 には誰でも貢献でき、その貢献にはさまざまな方法があります。

## バグレポートの提出

OreOreBot2 の不具合を発見した際は **[Issues](https://github.com/approvers/OreOreBot2/issues/new/choice) -> バグ報告** の順に進んで表示されるフォームからバグレポートを提出できます。

提出する際は以下の項目を満たしているか確認してください。

- [ ] OreOreBot2 の Issues に自分が今から報告しようとしていることと同じ Issue はない
- [ ] セキュリティーに関する不具合ではない

バグレポートは **詳細、再現方法、期待する動作、はらちょのバージョン** 全て記載した状態で報告を行ってください。

### セキュリティーに関する不具合の報告

セキュリティーに関する不具合は Issue ではなく、適切な方法で報告する必要があります。

報告する方法は2つあります。どちらで報告しても構いません。

1. `me@m2en.dev` 宛に以下のGPG鍵で署名したメールを送信する
  鍵指紋: `78E4 CFE0 B3B2 0C4C 7BAA A3CA 6554 A829 D251 53F9` , [pgp_keys.asc](https://keybase.io/m2en/pgp_keys.asc?fingerprint=78e4cfe0b3b20c4c7baaa3ca6554a829d25153f9)
2. [GitHub Security Advisories](https://github.com/approvers/OreOreBot2/security/advisories/new) からセキュリティ勧告を作成する

上記2つの方法、どちらとも以下の情報を詳細に記載してください。

- `Impact` - どのような脆弱性で、誰が影響を受けるのか
- `Process` - 問題を再現するための手段
- `PoC` - 概念実証。脆弱性を利用した攻撃が可能であることを示す実際のコード
- `Version` - 脆弱性が存在するバージョン
