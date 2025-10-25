# `@oreorebot2/docs`

OreOreBot2 のドキュメントを提供するパッケージ。

## 必要動作環境

- [pnpm](https://pnpm.io/) v10

## 開発環境の使用方法

すべてルートディレクトリ上で実行します。

`@oreorebot2/common` (ルートディレクトリ) 上で `pnpm install` を実行すると自動的に `@oreorebot2/common`, `@oreorebot2/docs` にも依存関係がインストールされます。

```shell
# ビルド (Static Export を使用しているため、ビルド成果物をそのまま起動することはできません)
pnpm build:docs

# 開発サーバーでの起動
pnpm dev:docs
```
