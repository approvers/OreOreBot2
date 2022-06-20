import type { Message, PartialMessage } from 'discord.js';
import {
  converterWithPrefix,
  observableTransformer
} from './transformer/message-convert.js';
import type { EditingObservable } from '../service/difference-detector.js';
import type { MessageHandler } from './index.js';
import { botFilter } from './transformer/bot-filter.js';
import { tupleTransformer } from './transformer/tuple.js';

export type RawMessage = Message | PartialMessage;

/**
 * メッセージ `M` に対する処理を、`N` に対する処理へと変換する。
 *
 * @export
 * @interface Transformer
 * @template M
 */
export interface Transformer<M, N> {
  (handler: MessageHandler<M>): MessageHandler<N>;
}

const connectTransformer =
  <M, N, O>(
    first: Transformer<M, N>,
    second: Transformer<N, O>
  ): Transformer<M, O> =>
  (handler: MessageHandler<M>) =>
    second(first(handler));

export const transformerForMessage = () =>
  connectTransformer(observableTransformer, botFilter);

export const transformerForCommand = (prefix: string) =>
  connectTransformer(converterWithPrefix(prefix), botFilter);

export const transformerForUpdateMessage = (): Transformer<
  [EditingObservable, EditingObservable],
  [RawMessage, RawMessage]
> => tupleTransformer(connectTransformer(observableTransformer, botFilter));
