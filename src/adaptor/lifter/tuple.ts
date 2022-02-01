/*
    /-> A1 -------> B1 -> B1*B1 -\
  A1*A2     A -> B             B1*B2
    \-> A2 -------> B2 -> B2*B2 -/

  This will be transformed:

        /- A1=> <----------- B1=> <- B1*B1=> <-\
  A1*A2=>        B=> -> A=>                B1*B2=>
        \- A2=> <----------- B2=> <- B2*B2=> <-/
*/

import type { Lifter } from '.';
import type { MessageHandler } from '..';

// A1=> -> A2=> -> A1*A2=>
const merge =
  <A>(f1: MessageHandler<A>, f2: MessageHandler<A>): MessageHandler<[A, A]> =>
  async ([first, second]) => {
    await Promise.all([f1(first), f2(second)]);
  };

// B1*B2=> -> B1*B1=>
const pickFirst =
  <B>(f: MessageHandler<[B, B]>) =>
  ([first]: [B, B]) =>
    f([first, first]);

// B1*B2=> -> B2*B2=>
const pickSecond =
  <B>(f: MessageHandler<[B, B]>) =>
  ([, second]: [B, B]) =>
    f([second, second]);

// B*B=> -> B=>
const flatten =
  <B>(f: MessageHandler<[B, B]>) =>
  (b: B) =>
    f([b, b]);

export const tupleLifter =
  <T, U>(lifter: Lifter<T, U>): Lifter<[T, T], [U, U]> =>
  (handler) =>
    merge(
      lifter(flatten(pickFirst(handler))),
      lifter(flatten(pickSecond(handler)))
    );
