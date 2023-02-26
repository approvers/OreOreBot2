import type { MemeTemplate } from '../../../model/meme-template.js';

const positionalKeys = ['domain', 'way'] as const;

export const clang: MemeTemplate<
  never,
  never,
  (typeof positionalKeys)[number]
> = {
  commandNames: ['clang', 'c'],
  description: '〜の天才\n9つの〜を操る',
  docId: 'clang',
  requiredPositionalKeys: positionalKeys,
  errorMessage: 'エラーの天才\n9つの引数エラーを操る',
  generate({ requiredPositionals: { domain, way } }) {
    return `${domain}の天才\n9つの${way}を操る`;
  }
};
