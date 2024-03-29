import type { Dep0 } from '../driver/dep-registry.js';

export interface RandomGenerator {
  /**
   * 0 以上 59 以下の乱数を生成する。
   *
   * @returns 生成した乱数
   */
  minutes(): number;

  /**
   * `array` からランダムな一要素を取り出す。
   *
   * @typeParam T - リストの型
   * @param array - 取り出す対象のリスト
   * @returns `array` から取り出した 1 つの要素
   *
   * @remarks
   *
   * `array` の長さは `1` 以上でなければならない。さもなくば `T` 型の値が返ることは保証されない。
   */
  pick<T>(array: readonly T[]): T;

  /**
   * ランダムに少しの間だけ待ってから解決する `Promise` を返す。
   *
   * @returns ランダムな経過時間後に解決される `Promise`
   */
  sleep(): Promise<void>;

  /**
   * `from` 以上 `to` 未満の一様にランダムな整数を返す。
   *
   * @param from - 生成する乱数の下限 (同じ数値を含む)
   * @param to - 生成する乱数の上限 (同じ数値を含まない)
   * @returns 生成した乱数
   */
  uniform(from: number, to: number): number;

  /**
   *
   * @param faces - ダイスの面の数
   * @param howManyRolls - 振るダイスの個数
   * @returns 降ったダイスの数値のリスト。長さは `howManyRolls` に等しい。
   */
  roll(faces: number, howManyRolls: number): number[];
}
export interface RandomGeneratorDep extends Dep0 {
  type: RandomGenerator;
}
export const randomGeneratorKey = Symbol(
  'RANDOM_GENERATOR'
) as unknown as RandomGeneratorDep;

export const dummyRandomGenerator: RandomGenerator = {
  minutes: () => 1,
  pick: ([elem]) => elem,
  sleep: () => Promise.resolve(),
  uniform: (from) => from,
  roll: (_faces: number, howManyRolls: number): number[] =>
    Array(howManyRolls).map(() => 1)
};
