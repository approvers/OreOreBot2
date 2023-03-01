import type { MemeTemplate } from '../../../model/meme-template.js';

const sourceLink = 'https://healthy-person-emulator.org/';

const positionalKeys = ['title'] as const;

export const kenjou: MemeTemplate<
  never,
  never,
  (typeof positionalKeys)[number]
> = {
  commandNames: ['kenjou'],
  description: `[健常者エミュレーターWiki](${sourceLink})の構文ジェネレーター。\n健常者エミュレーターWikiにありそうなタイトルを指定すればうまくいきます。`,
  pageName: 'kenjou',
  requiredPositionalKeys: positionalKeys,
  errorMessage:
    'はらちょのミーム機能を使うときは引数を忘れない方がいい - 健常者エミュレータ事例集Wiki',
  generate(args) {
    return `${args.requiredPositionals.title} - 健常者エミュレータ事例集Wiki`;
  }
};
