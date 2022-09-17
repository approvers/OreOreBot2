import type { Middleware, RawMessage } from '../middleware.js';

import type { BoldItalicCop } from '../../../service/bold-italic-cop.js';
import type { DeletionObservable } from '../../../service/deletion-repeater.js';
import type { EditingObservable } from '../../../service/difference-detector.js';
import type { EmojiSeqObservable } from '../../../service/emoji-seq-react.js';
import type { Snowflake } from '../../../model/id.js';
import type { TypoObservable } from '../../../service/command/typo-record.js';

const getAuthorSnowflake = (message: RawMessage): Snowflake =>
  (message.author?.id || 'unknown') as Snowflake;

const fetchMessage = async (message: RawMessage) => {
  await message.fetch().catch(() => {
    // 取得に失敗した場合は既に削除されたかアクセスできない可能性が高いため、エラーは無視します。
    // 実際に削除されたメッセージに対しては、`fetch` に失敗するもののキャッシュが残っているため引き続き動作可能です。
  });
};

const observableMessage = (
  raw: RawMessage
): EditingObservable &
  DeletionObservable &
  TypoObservable &
  BoldItalicCop &
  EmojiSeqObservable => ({
  authorId: getAuthorSnowflake(raw),
  author: raw.author?.username || '名無し',
  content: raw.content || '',
  async sendToSameChannel(message: string): Promise<void> {
    await raw.channel.send(message);
  },
  async replyMessage(message): Promise<void> {
    await raw.reply(message);
  },
  async addReaction(reaction): Promise<void> {
    await raw.react(reaction);
  }
});

export const observableMiddleware: Middleware<
  RawMessage,
  EditingObservable &
    DeletionObservable &
    TypoObservable &
    BoldItalicCop &
    EmojiSeqObservable
> = async (raw) => {
  await fetchMessage(raw);
  if (raw.content === null || raw.content === '') {
    throw new Error('the message was null');
  }
  return observableMessage(raw);
};
