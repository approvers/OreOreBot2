/*
    /-> A1 -------> B1 -\
  A1*A2     A -> B    B1*B2
    \-> A2 -------> B2 -/

  This will be transformed:

        /- A1=> <----------- B1=> <-\
  A1*A2=>        B=> -> A=>    B1*B2=>
        \- A2=> <----------- B2=> <-/
*/

import type { MessageHandler } from '../index.js';
import type { Transformer } from '../transformer.js';

// A1=> -> A2=> -> A1*A2=>
const merge =
  <A>(f1: MessageHandler<A>, f2: MessageHandler<A>): MessageHandler<[A, A]> =>
  async ([first, second]) => {
    await Promise.all([f1(first), f2(second)]);
  };

// B1*B2=> -> B1=>*B2=>
const split = <B>(
  f: MessageHandler<[B, B]>
): [MessageHandler<B>, MessageHandler<B>] => {
  let firstB: B | undefined = undefined;
  let secondB: B | undefined = undefined;
  const set = async ([first, second]: [B, undefined] | [undefined, B]) => {
    if (first) {
      firstB = first;
    }
    if (second) {
      secondB = second;
    }
    if (firstB && secondB) {
      await f([firstB, secondB]);
      firstB = undefined;
      secondB = undefined;
    }
  };
  const f1: MessageHandler<B> = async (first: B) => set([first, undefined]);
  const f2: MessageHandler<B> = async (second: B) => set([undefined, second]);
  return [f1, f2];
};

export const tupleTransformer =
  <T, U>(transformer: Transformer<T, U>): Transformer<[T, T], [U, U]> =>
  (handler) => {
    const [first, second] = split(handler);
    return merge(transformer(first), transformer(second));
  };
