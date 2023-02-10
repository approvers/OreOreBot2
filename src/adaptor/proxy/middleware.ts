import type { Message, PartialMessage } from 'discord.js';

import { botFilter } from './middleware/bot-filter.js';
import { observableMiddleware } from './middleware/message-convert.js';

export type RawMessage = Message | PartialMessage;

/**
 * メッセージ `M` を `N` へと変換するか、`Promise` を拒否して処理を中断する。
 *
 * @typeParam M - 変換前のメッセージの型
 * @typeParam N - 変換後のメッセージの型
 */
export interface Middleware<M, N> {
  (message: M): Promise<N>;
}

const connectMiddleware =
  <M, N, O>(
    first: Middleware<M, N>,
    second: Middleware<N, O>
  ): Middleware<M, O> =>
  (message: M) =>
    first(message).then(second);

const liftTuple =
  <T, U>(m: Middleware<T, U>): Middleware<[T, T], [U, U]> =>
  ([t1, t2]) =>
    Promise.all([m(t1), m(t2)]);

const sameMessageFilter: Middleware<
  [RawMessage, RawMessage],
  [RawMessage, RawMessage]
> = ([before, after]) => {
  if (before.id === after.id) {
    return Promise.resolve([before, after]);
  }
  return Promise.reject(new Error('author of edited messages was differ'));
};

export const middlewareForMessage = () =>
  connectMiddleware(botFilter, observableMiddleware);

export const middlewareForUpdateMessage = () =>
  connectMiddleware(sameMessageFilter, liftTuple(middlewareForMessage()));
