import type { Message, PartialMessage } from 'discord.js';
import type { EditingObservable } from '../../service/difference-detector';
import type { MessageHandler } from '..';
import { execOnlyUserMessage } from './bot-filter';
import {
  converterWithPrefix,
  observableLifter,
  observableMessage
} from './message-convert';

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
  connectLifter(observableLifter, execOnlyUserMessage);

export const lifterForCommand = (prefix: string) =>
  connectLifter(converterWithPrefix(prefix), execOnlyUserMessage);

export const lifterForUpdateMessage =
  (): Lifter<
    [EditingObservable, EditingObservable],
    [RawMessage, RawMessage]
  > =>
  (handler: MessageHandler<[EditingObservable, EditingObservable]>) =>
  async ([before, after]: [RawMessage, RawMessage]) => {
    if (!after.author?.bot) {
      await handler([observableMessage(before), observableMessage(after)]);
    }
  };
