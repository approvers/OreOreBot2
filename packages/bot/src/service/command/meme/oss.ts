import type { MemeTemplate } from '../../../model/meme-template.js';

const positionalKeys = ['group'] as const;

export const oss: MemeTemplate<never, never, (typeof positionalKeys)[number]> = {
  commandNames: ['oss'],
  description: 'OSS ライセンスに対する無理解を晒します.',
  pageName: 'oss',
  requiredPositionalKeys: positionalKeys,
  errorMessage: '【急募】批評対象',
  generate({requiredPositionals: { group}}) {
    return `えっ、丸パクリじゃん。
せめてどこから取ってきたかぐらい
もっと書くべき。
${group}だからって、何でも許されるわけと
ちゃうやろ・・・
${group}って基本こういうイメージ、怖い・・・`;
  }
};
