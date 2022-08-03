import type { Message, PartialMessage } from 'discord.js';
import {
  observableMiddleware,
  prefixMiddleware
} from './middleware/message-convert.js';
import { botFilter } from './middleware/bot-filter.js';

export type RawMessage = Message | PartialMessage;

/**
 * メッセージ `M` を `N` へと変換するか、`Promise` を拒否して処理を中断する。
 *
 * @export
 * @interface Middleware
 * @template M 変換前のメッセージの型
 * @template N 変換後のメッセージの型
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
  (tt) =>
    Promise.all([m(tt[0]), m(tt[1])]);

export const middlewareForMessage = () =>
  connectMiddleware(botFilter, observableMiddleware);

export const transformerForCommand = (prefix: string) =>
  connectMiddleware(botFilter, prefixMiddleware(prefix));

export const transformerForUpdateMessage = () =>
  liftTuple(connectMiddleware(botFilter, observableMiddleware));
