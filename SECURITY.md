# Security Policy

ここでは OreOreBot2 のセキュリティポリシーについて説明します。

## Supported Versions

以下のテーブルは、OreOreBot2 のサポートバージョンを示しています。

| Version  | Supported | Support Start Date                                                        | Support End Date |
| -------- | --------- | ------------------------------------------------------------------------- | ---------------- |
| `v1.x.y` | ✅        | [2022/02/27](https://github.com/approvers/OreOreBot2/releases/tag/v1.0.0) | 未定             |

## Reporting a Vulnerability

OreOreBot2 自身の脆弱性を発見した際は [me@m2en.dev](mailto:me@m2en.dev) まで GPG 鍵で暗号化を行ってからご連絡ください。
当リポジトリの Issue や、Twitter の公開スレッドなど、外部から見えてしまう場所での報告はご遠慮ください。

暗号化を行う際の GPG 鍵は以下の通りです。

[pgp_keys.asc](https://keybase.io/merunno/pgp_keys.asc?fingerprint=6e23c654c587e55dfafa8d4715db72f06f2acc5c)

また、これらの脆弱性をより早く解決するために、以下の情報をできる限り多く提供してください。

- 脆弱性の種類
  - (例: SQL インジェクション、コード・インジェクション、リソース管理の問題、設計上の問題、認可・権限・アクセス制御)
- 脆弱性に関連するソースファイルのフルパス
- 脆弱性に関連するソースコードのタグ、コミットハッシュ、permlink など
- 脆弱性を再現するために必要な特別な設定
- 問題を再現するための手順
- PoC(概念実証)(可能であれば)
- 脆弱性の影響
