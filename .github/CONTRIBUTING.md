# OreOreBot2 への貢献

OreOreBot2 には誰でも貢献でき、その貢献にはさまざまな方法があります。

- [バグレポートの提出](#バグレポートの提出)
  - [セキュリティーに関する不具合の報告](#セキュリティーに関する不具合の報告)
- [新機能リクエストの提出](#新機能リクエストの提出)
- [プルリクエストの提出](#プルリクエストの提出)
  - [開発参加の流れ](#開発参加の流れ)
  - [コーティング規約](#コーティング規約)
  - [テストについて](#テストについて)
  - [コミットメッセージ](#コミットメッセージ)
  - [その他](#その他)
- [GitHub Sponsor の掲載条件](#github-sponsor-の掲載条件)
- [開発環境](#開発環境)
  - [機能の有効・無効](#機能の有効無効)
  - [音楽再生系の機能](#音楽再生系の機能)

## バグレポートの提出

OreOreBot2 の不具合を発見した際は **[Issues](https://github.com/approvers/OreOreBot2/issues/new/choice) -> バグ報告** の順に進んで表示されるフォームからバグレポートを提出できます。

提出する際は以下の項目を満たしているか確認してください。

- [ ] OreOreBot2 の Issues に自分が今から報告しようとしていることと同じ Issue はない
- [ ] セキュリティーに関する不具合ではない

バグレポートは **詳細、再現方法、期待する動作、はらちょのバージョン** 全て記載した状態で報告を行ってください。

### セキュリティーに関する不具合の報告

セキュリティーに関する不具合は Issue ではなく、適切な方法で報告する必要があります。

報告する方法は 2 つあります。どちらで報告しても構いません。

1. `me@m2en.dev` 宛に以下の GPG 鍵で署名したメールを送信する
   鍵指紋: `78E4 CFE0 B3B2 0C4C 7BAA A3CA 6554 A829 D251 53F9` , [pgp_keys.asc](https://keybase.io/m2en/pgp_keys.asc?fingerprint=78e4cfe0b3b20c4c7baaa3ca6554a829d25153f9)
2. [GitHub Security Advisories](https://github.com/approvers/OreOreBot2/security/advisories/new) からセキュリティ勧告を作成する

上記 2 つの方法、どちらとも以下の情報を詳細に記載してください。

- `Impact` - どのような脆弱性で、誰が影響を受けるのか
- `Process` - 問題を再現するための手段
- `PoC` - 概念実証。脆弱性を利用した攻撃が可能であることを示す実際のコード (可能であれば)
- `Version` - 脆弱性が存在するバージョン

## 新機能リクエストの提出

OreOreBot2 に追加したい機能がある場合は **[Issues](https://github.com/approvers/OreOreBot2/issues/new/choose) -> 機能要望** の順に進んで表示されるフォームからリクエストを提出できます。

なお、リクエストを必ずしも実現する保証はできません。

## プルリクエストの提出

プルリクエストを提出することで OreOreBot2 の開発に参加できます。

### 開発参加の流れ

1. 当リポジトリをフォークする
   - approvers のメンバーはフォークする必要はありません。
2. フォークしたリポジトリ(または 当リポジトリ)をローカルにクローンする
   ```shell
   git clone https://github.com/approvers/OreOreBot2.git
   cd OreOreBot2
   ```
3. ブランチを作成、チェックアウトする
   ```shell
   git checkout -b <branch-name>
   ```
4. 開発を行い、その内容を GitHub にプッシュする
   ```shell
   git add <file-name>
   git commit -m <commit-message>
   git push
   ```
5. 開発が完了したら GitHub にアクセスし、 当リポジトリの `main` ブランチへのプルリクエストを作成してください。
6. 当リポジトリ コントリビューターによるレビュー・CI によるテストが行われた後、マージできます。

### コーティング規約

1. 型、クラスの命名には `PascalCase` を使用する
2. 関数、変数の命名には `camelCase` を使用する
3. `null` は使用せず、`undefined` を使用してください。
4. 文字列はシングルクォーテーションで囲ってください。

---

- ファイル名を小文字英字とハイフンのみの `kabeb-case` としてください。
- コミット時に必ず Husky で Prettier と ESLint を実行してください。
- 新機能の追加や、既存の機能の変更を行った際は[テストを追加](#テストについて)してください。

### テストについて

- OreOreBot2 ではテストフレームワーク [Vitest](https://vitest.dev/) を使用してテストを行っています。
- テストファイルの名前は `<file-name>.test.ts` とします。
  - `<file-name>` は機能の処理を行うファイルと同じ名前にし、 `.test.ts` との競合を回避するため、`<file-name>` で `.` を含めないようにしてください。
  - テストファイルは機能の処理を行うファイルと同じディレクトリに配置します。
    - ミーム構文のみ `test/` 配下に配置してください。

#### テストの例

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
import { Meme } from './meme.js';
import { createMockMessage } from './command-message.js';

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

詳しくは [Vitest Guide](https://vitest.dev/guide/) をご覧ください。

### コミットメッセージ

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

### その他

- プルリクエストのタイトルは Conventional Commit の型を使用して作成してください。
  - 例: `feat: えぬ留年構文ジェネレータの実装`, `fix: えぬが留年しない問題の修正`
- プルリクエスト作成時は Issue と同様テンプレートが用意されているので詳細情報の記載をお願いします。

## GitHub Sponsor の掲載条件

OreOreBot2 の Sponsor ボタンへの掲載は **OreOreBot2 にコントリビュートをしていること**が条件になります。

コントリビュートしていて、掲載を希望する場合は `.github/FUNDING.yml` へ自分のユーザー ID を追加し、プルリクエストを作成してください。

```yaml
github: [m2en, shun-shobon, su8ru]
```

## 開発環境

- `yarn start` でコンパイルしたビルドで起動します。
- `yarn dev` でコンパイルせずに起動します。
- `yarn build` でコンパイルします。
- `yarn test` でテストを実行します。

### 機能の有効・無効

環境変数 `FEATURE` で有効にする機能を指定できます。

複数の機能を起動するにはコンマで区切ります。指定しない場合は全ての機能が有効になります。

- `"MEESAGE_CREATE"` - メッセージ作成関連の機能
- `"MESSAGE_UPDATE"` - メッセージ更新関連の機能
- `"COMMAND"` - コマンド全般の機能
- `"VOICE_ROOM"` - VC 関連の機能
- `"ROLE"` - ロール関連の機能

### 音楽再生系の機能

`!party` などの音楽再生系の機能は利用するには、[FFmpeg](https://ffmpeg.org/) がインストールされていてその `PATH` が通っている必要があります。

開発の際はご注意ください。
