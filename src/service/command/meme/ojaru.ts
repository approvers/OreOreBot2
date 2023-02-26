import type { MemeTemplate } from '../../../model/meme-template.js';

const ojaruFlags = ['g'] as const;

const positionalKeys = ['achievement'] as const;

export const ojaru: MemeTemplate<
  (typeof ojaruFlags)[number],
  never,
  (typeof positionalKeys)[number]
> = {
  commandNames: ['ojaru'],
  description:
    'あっぱれおじゃる様！見事ミーム構文を使いこなされました！`-g`オプションを使用なさってデンボの口調の変更も可能でございます！',
  docId: 'ojaru',
  flagsKeys: ojaruFlags,
  requiredPositionalKeys: positionalKeys,
  errorMessage:
    'あっぱれおじゃる様！コマンド形式を間違えエラーをお出しになられました！',
  generate({ flags, requiredPositionals: { achievement } }) {
    if (flags.g) return `あっぱれおじゃる様！${achievement}でございます！`;
    return `あっぱれおじゃる様！見事${achievement}されました！`;
  }
};
