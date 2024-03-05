# OreOreBot2 への貢献

OreOreBot2 への貢献を検討していただきありがとうございます。

バグ報告や機能追加の提案、ドキュメントの改善など、様々な貢献をお待ちしています。

1. [OreOreBot2 への貢献](#oreorebot2-への貢献)
   1. [Issue の提出](#issue-の提出)
   2. [Pull Request の提出](#pull-request-の提出)
      1. [開発参加の流れ](#開発参加の流れ)
   3. [プロジェクトの構成](#プロジェクトの構成)
   4. [コミットメッセージ](#コミットメッセージ)
   5. [開発環境について](#開発環境について)
   6. [開発について](#開発について)
      1. [OreOreBot2 (`@oreorebot2/bot`)](#oreorebot2-oreorebot2bot)
         1. [コーディング規約](#コーディング規約)
         2. [テストの追加](#テストの追加)
         3. [機能の有効・無効](#機能の有効無効)
         4. [音楽再生系の機能](#音楽再生系の機能)
      2. [OreOreBot2 ドキュメント (`@oreorebot2/docs`)](#oreorebot2-ドキュメント-oreorebot2docs)
         1. [コーディング規約](#コーディング規約-1)
         2. [リファレンスの追加](#リファレンスの追加)

## Issue の提出

OreOreBot2 では以下のような Issue を提出することができます。

- [バグ報告のIssue](https://github.com/approvers/OreOreBot2/issues/new?assignees=&labels=C-bug&projects=&template=bug_report.yml)
- [ドキュメントに関するIssue](https://github.com/approvers/OreOreBot2/issues/new?assignees=&labels=T-Documents&projects=&template=content_report.yml)
- [機能要望のIssue](https://github.com/approvers/OreOreBot2/issues/new?assignees=&labels=C-enhancement&projects=&template=feature_request.yml)

これらの Issue はテンプレートが用意されており、それぞれの目的に応じた内容を記述することで、簡単に Issue を提出できます。

テンプレートを使用せず、[空の Issue を使用して提出することも可能です](https://github.com/approvers/OreOreBot2/issues/new)。ただしその場合はしっかり内容を記述してください。

## Pull Request の提出

自分で開発したり修正した機能・不具合を Pull Request として提出することも可能です。

### 開発参加の流れ

1. [OreOreBot2 のリポジトリ](https://github.com/approvers/OreOreBot2)をフォークする

リポジトリ画面の右上にある "Fork" から自分のアカウントにクローンしてください。

> **Note**
>
> approversのメンバーはフォークする必要はありません。

2. ローカルにクローンする

次のコマンドを実行してリポジトリをローカルにクローンしてください。

```shell
git clone https://github.com/approvers/OreOreBot2.git
```

3. 依存関係をインストールする

次のコマンドを実行して依存関係をインストールしてください。

このコマンドを実行すると共通のパッケージ・`@oreorebot2/bot`(はらちょ本体)・`@oreorebot2/docs`(はらちょのドキュメント)、それぞれの依存関係がインストールされます。

**必ず、ルートディレクトリ上で実行してください**。

```shell
bun install
```

4. ブランチを作成、チェックアウトする

ブランチ名には特に規則はありませんが、内容が逸脱しすぎているブランチ名ではプッシュしないでください。

```shell
git checkout -b <branch-name>
```

5. 開発を行い、その内容を GitHub にプッシュする

```shell
git add <file-name>
git commit -m <commit-message>
git push
```

6. 開発が完了したら GitHub の OreOreBot2 レポジトリ (フォーク元でもフォーク先でも可) にアクセスし、 当リポジトリの main ブランチへのプルリクエストを作成してください。
   当リポジトリのメンテナーによるレビューと CI によるテストが行われ、両方に合格すればマージできます。

## プロジェクトの構成

OreOreBot2 は以下のような構成になっています。

```
OreOreBot2 (@oreorebot2/common)
│
├── packages
│   │
│   ├── bot (@oreorebot2/bot) // OreOreBot2 本体
│   │
│   └── docs (@oreorebot2/docs) // OreOreBot2 のドキュメント
```

- ルートディレクトリ (`@oreorebot2/common`) 上は `@oreorebot2/bot`・`@oreorebot2/docs` で使用される依存関係やコンフィグファイルが管理されています。
  - このディレクトリ上で `bun install` を実行すると、`@oreorebot2/common`・`@oreorebot2/bot`・`@oreorebot2/docs` の依存関係がインストールされます。
- ルートディレクトリ (`@oreorebot2/common`) 上から `@oreorebot2/bot`・`@oreorebot2/docs` のスクリプトにアクセスすることが可能です。
- 依存関係をインストールする必要がある場合はインストール先に注意してください。それぞれパッケージの依存関係はそれぞれのディレクトリ上でインストールする必要があります。
  - 2つのパッケージ (`@oreorebot2/bot`・`@oreorebot2/docs`) に共通するような依存関係は `@oreorebot2/common` 上でインストールしてください。
  - それぞれのパッケージのみが依存するような依存関係はそれぞれのディレクトリ上でインストールしてください。

## コミットメッセージ

コミットメッセージを書く際は Conventional Commit に従ってください。

> Conventional Commits の仕様はコミットメッセージのための軽量の規約です。 明示的なコミット履歴を作成するための簡単なルールを提供します。この規則に従うことで自動化ツールの導入を簡単にします。 コミットメッセージで機能追加・修正・破壊的変更などを説明することで、この規約は SemVer と協調動作します。

コミットメッセージは次のような形にする必要があります。

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

`<type>` は、OreOreBot2 を使用する利用者や開発者に意図を伝えるために以下に記載するそれぞれの型を指定する必要があります。

| 型         | 要素                                                                           |
| ---------- | ------------------------------------------------------------------------------ |
| `fix`      | この型を持つコミットはコードベースのバグにパッチを当てます。                   |
| `feat`     | この型を持つコミットはコードベースに新しい機能を追加します。                   |
| `build`    | この型を持つコミットはプログラムをコンパイル、ビルドする部分の変更を行います。 |
| `ci`       | この型を持つコミットは GitHub Actions に関する変更を行います。                 |
| `docs`     | この型を持つコミットはドキュメントなどの変更を行います。                       |
| `refactor` | この型を持つコミットはコードベースのリファクタリングを行います。               |
| `chore`    | この型を持つコミットはファイル整理や依存関係の更新などを行います。             |

`BREAKING CHANGE` とフッターにかかれているか型/スコープの直後に `!` が追加されているコミットは仕様の破壊的変更を意味します。 (Semantic Versioning における `MAJOR` に相当します)

また、 `BREAKING CHANGE` は任意の型のコミットに含めることも可能です。

詳しくは [Conventional Commits](https://conventionalcommits.org/) を参照してください。

## 開発環境について

[プロジェクトの構成](#プロジェクトの構成) にあるように OreOreBot2 は `@oreorebot2/bot`・`@oreorebot2/docs` という2つのパッケージで構成されています。

それぞれのパッケージにはそれぞれの開発環境が用意されていますが、スクリプトを実行する場合はそれぞれのパッケージのディレクトリに移動する必要はありません。

以下は使用可能なスクリプトのリストです。

- `start`: ビルドした成果物で OreOreBot2 を起動します。
- `build:bot`: `@oreorebot2/bot` をビルドします。
- `build:docs`: `@oreorebot2/docs` をビルドします。
- `dev:bot`: `@oreorebot2/bot` を開発環境で起動します。コンパイルは実施しません。
- `dev:docs`: `@oreorebot2/docs` を開発サーバーで起動します。
- `lint:bot`, `lint:docs`: `@oreorebot2/bot`・`@oreorebot2/docs` のコードに対して ESLint を実行します。
- `format:bot`, `format:docs`: `@oreorebot2/bot`・`@oreorebot2/docs` のコードに対して Prettier を実行します。
- `test`: `@oreorebot2/bot` のテストを実行します。
- `coverage`: `@oreorebot2/bot` のカバレッジを計測します。

## 開発について

### OreOreBot2 (`@oreorebot2/bot`)

以下のものをインストールしていることを想定しています。

- Git
- FFmpeg ([音楽再生系の機能](#音楽再生系の機能)で必要です)
- bun v1

#### コーディング規約

1. 型、クラスの命名には `PascalCase` を使用してください。
2. 関数、変数の命名には `camelCase` を使用してください。
3. `null` は使用せず、`undefined` を使用してください。
4. 文字列はシングルクォーテーションで囲ってください。

---

- ファイル名を小文字英字とハイフンのみの `kabeb-case` としてください。
- コミット時に必ず Husky で Prettier と ESLint を実行してください。
- 新機能の追加や、既存の機能の変更を行った際は[テストを追加](#テストの追加)してください。

#### テストの追加

- OreOreBot2 ではテストフレームワーク [Vitest](https://vitest.dev/) を使用してテストを行っています。
- テストファイルの名前は `<file-name>.test.ts` とします。
  - `<file-name>` は機能の処理を行うファイルと同じ名前にし、 `.test.ts` との競合を回避するため、`<file-name>` で `.` を含めないようにしてください。
  - テストファイルは機能の処理を行うファイルと同じディレクトリに配置します。
    - ミーム構文のみ `test/` 配下に配置してください。

**コマンド**

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';

import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';
import { createMockMessage } from './command-message.js';
import { RoleInfo, RoleStatsRepository } from './role-info.js';

describe('RoleRank', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const repo: RoleStatsRepository = {
    fetchStats: (id) =>
      Promise.resolve(
        id === '101'
          ? {
              color: '1a1d1a',
              createdAt: new Date(20200101),
              position: 1,
              numOfMembersBelonged: 3
            }
          : null
      )
  };
  const roleInfo = new RoleInfo(repo);

  it('gets info of role', async () => {
    const fetchStats = vi.spyOn(repo, 'fetchStats');
    const fn = vi.fn();

    await roleInfo.on(
      createMockMessage(
        parseStringsOrThrow(['roleinfo', '101'], roleInfo.schema),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'ロールの情報',
      description: '司令官、頼まれていた <@&101> の情報だよ',
      fields: [
        {
          name: 'ID',
          value: '101',
          inline: true
        },
        {
          name: '所属人数',
          value: `3人`,
          inline: true
        },
        {
          name: 'ポジション',
          value: `1番目`,
          inline: true
        },
        {
          name: 'カラーコード',
          value: '1a1d1a',
          inline: true
        },
        {
          name: '作成日時',
          value: `<t:20200>(<t:20200:R>)`,
          inline: true
        }
      ],
      thumbnail: undefined
    });
    expect(fetchStats).toHaveBeenCalledOnce();
  });

  it('errors with invalid id', async () => {
    const fetchStats = vi.spyOn(repo, 'fetchStats');
    const fn = vi.fn();

    await roleInfo.on(
      createMockMessage(
        parseStringsOrThrow(['roleinfo', '100'], roleInfo.schema),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: '引数エラー',
      description: '指定のIDのロールが見つからないみたい……'
    });
    expect(fetchStats).toHaveBeenCalledOnce();
  });
});
```

**ミーム**

```ts
import { expect, it, vi } from 'vitest';

import { createMockMessage } from './command-message.js';
import { Meme } from './meme.js';

it('use case of hukueki', async () => {
  const fn = vi.fn();
  const responder = new Meme();
  await responder.on(
    createMockMessage(
      {
        args: ['hukueki', 'こるく']
      },
      fn
    )
  );
  expect(fn).toHaveBeenCalledWith({
    description:
      'ねぇ、将来何してるだろうね\n' +
      'こるくはしてないといいね\n' +
      '困らないでよ'
  });
});
```

詳しいテストの記述方法については [Vitest Guide](https://vitest.dev/guide/) をご覧ください。

#### 機能の有効・無効

環境変数 `FEATURE` で有効にする機能を指定できます。

以下の文字列をコンマで区切りで与えると、それら複数の機能を有効にして起動します。指定しない場合はスラッシュコマンドを除く全ての機能が有効になります。

- `"MEESAGE_CREATE"` - メッセージ作成関連の機能
- `"MESSAGE_UPDATE"` - メッセージ更新関連の機能
- `"COMMAND"` - コマンド全般の機能
- `"VOICE_ROOM"` - VC 関連の機能
- `"ROLE"` - ロール関連の機能
- `"EMOJI"` - 絵文字関連の機能
- `"STICKER"` - スタンプ関連の機能
- `"SLASH_COMMAND"` - スラッシュコマンド関連の機能 (指定しない場合はスラッシュコマンドは登録されず、メッセージコマンド形式だけになります。)
- `"MEMBER"` - メンバー関連の機能

#### 音楽再生系の機能

`!party` などの音楽再生系の機能は利用するには、[FFmpeg](https://ffmpeg.org/) がインストールされていてその `PATH` が通っている必要があります。

### OreOreBot2 ドキュメント (`@oreorebot2/docs`)

以下のものをインストールしていることを想定しています。

- Git
- bun v1

#### コーディング規約

1. コンポーネント、型の命名には `PascalCase` を使用してください。
2. 関数、変数の命名には `camelCase` を使用してください。
3. `null` は使用せず、`undefined` を使用してください。

----

- 各ページのファイル名は小文字英字とハイフンのみの `kabeb-case` としてください。
- コミット時に必ず Husky で Prettier と ESLint を実行してください。

#### リファレンスの追加

リファレンスは `docs/reference` に MDX ファイルとして追加してください。

- `commands`: 各コマンドのリファレンスを追加します。ファイル名と OreOreBot2 の `pageName` プロパティが一致するように書いてください。

```ts
// 例: src/commands/version.ts

help: Readonly<HelpInfo> = {
  title: 'はらちょバージョン',
  description: '現在の私のバージョンを出力するよ。',
  pageName: 'version'
};
```

- `features`: コマンド以外の機能のリファレンスを追加します。

**コマンドリファレンス**

コマンドリファレンスには以下の情報は必ず含めてください。

- 各引数が要求するものの説明

コンポーネント `CommandArgs` を使用することで綺麗に記述可能です。

```mdx
import { CommandArgs } from '../../../organisms/command-args';

# チャンネル情報表示

<CommandArgs
  versionAvailableFrom="v1.37.0"
  commandName="channelinfo/channel/chinfo"
  args={[
    {
      name: 'チャンネルID',
      about:
        '情報を表示したいチャンネルのIDです。チャンネルのメンションを指定しないようにしてください。'
    }
  ]}
/>
```

- どのバージョンから利用可能になったのか
  - 機能追加系のPRの場合は基本的にマイナーバージョンがあがります。

コンポーネント `CommandArgs` の `versionAvailableFrom` を指定するか、機能リファレンスの場合は `VersionBadge` を使用してください。

```mdx
import { FeatureBadge } from '../../../molecules/feature-badge';
import { VersionBadge } from '../../../molecules/version-badge';

# Kawaemon has given a new role

<FeatureBadge>その他</FeatureBadge>,<VersionBadge>v1.16.0</VersionBadge>
```
