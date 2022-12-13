import type { MemeTemplate } from '../../../model/meme-template.js';

const ojaruFlags = ['g'] as const;

export const ojaru: MemeTemplate<typeof ojaruFlags[number], never> = {
  commandNames: ['ojaru'],
  description:
    'あっぱれおじゃる様！見事ミーム構文を使いこなされました！`-g`にてオプションの達人でございます！',
  flagsKeys: ojaruFlags,
  optionsKeys: [],
  errorMessage:
    'あっぱれおじゃる様！コマンド形式を間違えエラーをお出しになられました！',
  generate(args) {
    if (args.flags.g) return `あっぱれおじゃる様！${args.body}でございます！`;
    return `あっぱれおじゃる様！見事${args.body}されました！`;
  }
};
