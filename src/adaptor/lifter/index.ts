import type { Message, PartialMessage } from 'discord.js';
import type { EditingObservable } from '../../service/difference-detector';
import type { MessageHandler } from '..';
import { botFilter } from './bot-filter';
import { converterWithPrefix, observableLifter } from './message-convert';
import { tupleLifter } from './tuple';

export type RawMessage = Message | PartialMessage;

/**
 * メッセージ `M` に対する処理を、`N` に対する処理へと変換する。
 *
 * @export
 * @interface Lifter
 * @template M
 */
export interface Lifter<M, N> {
  (handler: MessageHandler<M>): MessageHandler<N>;
}

const connectLifter =
  <M, N, O>(first: Lifter<M, N>, second: Lifter<N, O>): Lifter<M, O> =>
  (handler: MessageHandler<M>) =>
    second(first(handler));

export const lifterForMessage = () =>
  connectLifter(observableLifter, botFilter);

export const lifterForCommand = (prefix: string) =>
  connectLifter(converterWithPrefix(prefix), botFilter);

export const lifterForUpdateMessage = (): Lifter<
  [EditingObservable, EditingObservable],
  [RawMessage, RawMessage]
> => connectLifter(tupleLifter(observableLifter), tupleLifter(botFilter));
