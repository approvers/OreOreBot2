import type { MemeTemplate } from '../../../model/meme-template.js';

const takopiFlags = ['f'] as const;
const takopiOptions = ['c'] as const;
const positionalKeys = ['subject'] as const;

export const takopi: MemeTemplate<
  (typeof takopiFlags)[number],
  (typeof takopiOptions)[number],
  (typeof positionalKeys)[number]
> = {
  commandNames: ['takopi'],
  description:
    '「〜、出して」\n`-f` で教員と自分の名前の位置を反対にします。\n`-c <教員の名前> <出すもの>`で教員の名前も変更可能です。',
  flagsKeys: takopiFlags,
  optionsKeys: takopiOptions,
  requiredPositionalKeys: positionalKeys,
  errorMessage: '(引数が)わ、わかんないっピ.......',
  generate(args, author) {
    const takopiArgs = {
      takopi: author,
      shizuka: args.options.c ?? '教員',
      goods: args.requiredPositionals.subject ?? '課題'
    };

    if (args.flags.f) {
      const temp: string = takopiArgs.takopi;
      takopiArgs.takopi = takopiArgs.shizuka;
      takopiArgs.shizuka = temp;
    }
    return `${takopiArgs.shizuka}「${takopiArgs.goods}、出して」\n${takopiArgs.takopi}「わ、わかんないっピ.......」`;
  }
};
