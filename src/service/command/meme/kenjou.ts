import type { MemeTemplate } from '../../../model/meme-template.js';

export const kenjou: MemeTemplate<never, never> = {
  commandNames: ['kenjou'],
  description:
    '[健常者エミュレーター](https://healthy-person-emulator.memo.wiki/)の構文ジェネレーター',
  flagsKeys: [],
  optionsKeys: [],
  errorMessage:
    'はらちょのミーム機能を使うときは引数を忘れない方がいい - 健常者エミュレータ事例集Wiki',
  generate(args) {
    return `${args.body} - 健常者エミュレータ事例集Wiki`;
  }
};
