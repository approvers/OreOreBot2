import type { MemeTemplate } from '../../../model/meme-template.js';

const sourceTitle = '健常者エミュレータ事例集';
const sourceLink = 'https://healthy-person-emulator.org/';

const positionalKeys = ['title'] as const;

export const kenjou: MemeTemplate<
  never,
  never,
  (typeof positionalKeys)[number]
> = {
  commandNames: ['kenjou'],
  description: `[${sourceTitle}](${sourceLink})の構文ジェネレーター。\n${sourceTitle}にありそうなタイトルを指定すればうまくいきます。`,
  pageName: 'kenjou',
  requiredPositionalKeys: positionalKeys,
  errorMessage: `はらちょのミーム機能を使うときは引数を忘れない方がいい - ${sourceTitle}`,
  generate(args) {
    return `${args.requiredPositionals.title} - ${sourceTitle}`;
  }
};
