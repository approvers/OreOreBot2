/// 必要な環境変数名を可変長引数に渡すと, 環境変数ごとに対応した値が入ったオブジェクトを返す.
///
/// 対応した環境変数が定義されていない場合は `defaults` に設定した値へとフォールバックする.
///
/// # 例外
///
/// 対応した環境変数が定義されておらず `defaults` にも存在しない場合は例外を送出する.
///
/// # 使用例
///
/// ```ts
/// const env = extractEnv(["DISCORD_TOKEN", "MAIN_CHANNEL_ID"]);
/// ```
export function extractEnv<K extends string>(
  keys: readonly K[],
  defaults?: Readonly<Partial<Record<K, string>>>
): Record<K, string> {
  const env: Partial<Record<K, string>> = {};
  // `K` は可変長引数である配列の値が取りうる型で, キーのリテラル型全ての直和型が得られる.
  // この直和型を `Record` のキーにすればいい感じの戻り値型になる.
  // (`Record` についてはこちらを参照: https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)
  // だから, 戻り値型は `Record<K, string>` になる.
  for (const key of keys) {
    // `keys` から一個ずつ取り出して
    if (process.env[key] !== undefined && process.env[key] !== '') {
      // 存在したらそれに設定
      env[key] = process.env[key];
    } else if (defaults?.[key] !== undefined) {
      // `defaults` にフォールバック
      env[key] = defaults[key];
    } else {
      // 存在しなければ例外を送出
      throw new Error(`env is not set: ${key}`);
    }
  }
  // すでに問題ないことを確認したので `as` で変換
  return env as Record<K, string>;
}
