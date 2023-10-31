# `@oreorebot2/docs`

OreOreBot2 のドキュメントを提供するパッケージ。

## 必要動作環境

- [Node.js](https://nodejs.org/) v18.x 以上
- [Yarn](https://yarnpkg.com/) v4

## 開発環境の使用方法

すべてルートディレクトリ上で実行します。

`@oreorebot2/common` (ルートディレクトリ) 上で `yarn install` を実行すると自動的に `@oreorebot2/common`, `@oreorebot2/docs` にも依存関係がインストールされます。

```shell
# ビルド (Static Export を使用しているため、ビルド成果物をそのまま起動することはできません)
yarn run build:docs

# 開発サーバーでの起動
yarn run dev:docs
```
