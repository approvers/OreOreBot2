# Security Policy

**last updated**: `2022/09/11`

ここでは OreOreBot2 のセキュリティポリシーについて説明します。

- [Security Policy](#security-policy)
  - [Supported Versions](#supported-versions)
  - [Reporting a Vulnerability](#reporting-a-vulnerability)

## Supported Versions

以下のテーブルは、OreOreBot2 のサポートバージョンを示しています。

| Version  | Supported | Support Start Date                                                        | Support End Date |
| -------- | --------- | ------------------------------------------------------------------------- | ---------------- |
| `v1.x.y` | ✅        | [2022/02/27](https://github.com/approvers/OreOreBot2/releases/tag/v1.0.0) | 未定             |

## Reporting a Vulnerability

OreOreBot2 自身の脆弱性を発見した際は [me@m2en.dev](mailto:me@m2en.dev) までご連絡ください。
当リポジトリの Issue や、Twitter の公開スレッドなど、外部から見えてしまう場所での報告はご遠慮ください。

[me@m2en.dev](mailto:me@m2en.dev) に報告する際は GPG 鍵で暗号化を行ってから報告を行ってください。

暗号化を行う際の GPG 鍵は以下の通りです。

<details><summary>セキュリティ報告に使用する GPG鍵</summary><div>

fingerprint = `6E23 C654 C587 E55D FAFA 8D47 15DB 72F0 6F2A CC5C`

```
-----BEGIN PGP PUBLIC KEY BLOCK-----

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
=HnDf
-----END PGP PUBLIC KEY BLOCK-----
```

</div></details>

また、これらの脆弱性をより早く解決するために、以下の情報をできる限り多く提供してください。

- 脆弱性の種類
  - (例: SQL インジェクション、コード・インジェクション、リソース管理の問題、設計上の問題、認可・権限・アクセス制御)
- 脆弱性に関連するソースファイルのフルパス
- 脆弱性に関連するソースコードの場所 (tag, branch, commit, permalink)
- 脆弱性を再現するために必要な特別な設定
- 問題を再現するための手順
- PoC(概念実証)(可能であれば)
- 脆弱性の影響