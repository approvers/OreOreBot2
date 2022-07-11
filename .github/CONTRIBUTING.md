# OreOreBot2 への貢献

## このプロジェクトについて

限界開発鯖の Bot [【はらちょ】](https://github.com/approvers/OreOreBot) を discord.js +
TypeScript で作り直すプロジェクトです。

## 貢献の流れ

1. 当リポジトリをフォークしてください。
2. フォークしたリポジトリをクローンしてください。
3. ディレクトリを開き、ブランチをチェックアウトしてください。

```sh
git checkout -b <branch-name>
```

4. 開発を行い、その内容を GitHub へアップロードします。

```sh
git add <file-name>
git commit -m "hoge"
git push
```

5. 開発が終了したら GitHub から当リポジトリの `main` ブランチへ新規 pull request を作成してください。
6. 当プロジェクト コントリビューターによるレビュー・GitHub Actions によるテストなどが行われた後、マージが可能になります。

## コーティング規約

- ファイル名を `kebab-case` にしてください。
- ファイル名に以下の記号は使用しないでください。
  - `¥`: 円マーク
  - `/`: スラッシュ
  - `\`: バックスラッシュ
  - `:`: コロン
  - `*`: アスタリスク
  - `?`: クエスチョンマーク
  - `"`: 2重引用符
  - `<`: 不等号(大)
  - `>`: 不等号(小)
  - `|`: バーティカルバー
    - これらのファイル名はWindows OSで使用できず、使用してしまうとエラーでWindows OSが利用できなくなってしまいます。
  - また、機種依存文字・特殊文字はOSによってエラー等が発生する可能性があります。使用しないようにお願いします。

## テストについて

新機能の追加や、既存の機能の変更などを行った際はテストを追加してください。

- [Jest](https://jestjs.io/ja/) を使用してテストしています。
- テストファイルの名前は `<file-name>.test.ts` とします。
  - `<file-name>` は機能の処理を行うファイルと同じ名前にし、 `.test.ts` との競合を回避するため、`<file-name>` で `.` は含めないようにしてください。
  - 必ず `service` ディレクトリに配置してください。

### テストの例

```typescript
test('use case of hukueki', async () => {
  const responder = new Hukueki();
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['hukueki', 'こるく']
      },
      (message) => {
        expect(message).toStrictEqual({
          description:
            'ねぇ、将来何してるだろうね\n' +
            'こるくはしてないといいね\n' +
            '困らないでよ'
        });
        return Promise.resolve();
      }
    )
  );
});
```

詳しくは [Jest のドキュメント](https://jestjs.io/ja/docs/getting-started) をご覧ください。

## コミットメッセージ

コミットメッセージを書く際は [**Conventional Commit**](https://conventionalcommits.org/ja/) に従ってください。

> Conventional Commits の仕様はコミットメッセージのための軽量の規約です。 明示的なコミット履歴を作成するための簡単なルールを提供します。この規則に従うことで自動化ツールの導入を簡単にします。 コミットメッセージで機能追加・修正・破壊的変更などを説明することで、この規約は SemVer と協調動作します。
> 引用: [Conventional Commits](https://conventionalcommits.org/ja/)

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

### 例 (引用: [Conventional Commits](https://conventionalcommits.org/ja))

#### タイトルおよび破壊的変更のフッターを持つコミットメッセージ

```
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

#### 本文を持たないコミットメッセージ

```
docs: correct spelling of CHANGELOG
```

詳しくは [Conventional Commits](https://conventionalcommits.org/) を参照してください。

## Issue

不具合報告や機能の要望、立案を行う際は [Issue](https://github.com/approvers/OreOreBot2/issues/new/choose) を利用してください。

OreOreBot2 では Issue Template を用意しています。

- [Bug-report](https://github.com/approvers/OreOreBot2/issues/new?assignees=&labels=bug&template=bug-report.md&title=)
  - OreOreBot2 の不具合を報告する際に使用してください。
- [Feature-request](https://github.com/approvers/OreOreBot2/issues/new?assignees=&labels=enhancement&template=feature-request.md&title=feat%3A+)
  - OreOreBot2 の新機能立案などを行う際に使用してください。
- [Custom-Issue](https://github.com/approvers/OreOreBot2/issues/new?assignees=&labels=&template=custom-issue.md&title=)
  - 上記に当てはまらない内容の Issue を立てたいときに使用してください。
  - 完全カスタマイズの Issue を作る際もこれを使用してください。
- [Discord](https://support.discord.com/hc/ja/requests/new?ticket_form_id=360006586013)
  - Discord の不具合は言わずもがな **Discord 運営チーム**　に報告してください。

## Pull Request

- Pull Request のタイトルは Conventional Commit の型を使用して作成してください。
  - 例: `feat: えぬ留年構文ジェネレータの実装`, `fix: えぬが留年しない問題の修正`
- Pull Request 作成時は Issue と同様テンプレートが用意されているので詳細情報の記載をお願いします。
- draft などぜひ有効活用してください。
  - 一度作成しても Assign の欄に `Still in progress? Convert to draft` とわかりにくいですがこれを利用することで途中からでも draft に設定できます。
