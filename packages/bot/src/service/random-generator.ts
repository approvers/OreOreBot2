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
}
export interface RandomGeneratorDep extends Dep0 {
  type: RandomGenerator;
}
export const randomGeneratorKey = Symbol(
  'RANDOM_GENERATOR'
) as unknown as RandomGeneratorDep;
