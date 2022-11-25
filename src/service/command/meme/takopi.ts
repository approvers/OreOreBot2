import type { MemeTemplate } from '../../../model/meme-template.js';

const takopiFlags = ['f', 'c'] as const;

export const takopi: MemeTemplate<typeof takopiFlags[number], never> = {
  commandNames: ['takopi'],
  description:
    '「〜、出して」\n`-f` で教員と自分の名前の位置を反対にします。\n`-c`で教員の名前も変更可能です。\n([idea: フライさん](https://github.com/approvers/OreOreBot2/issues/90))',
  flagsKeys: takopiFlags,
  optionsKeys: [],
  errorMessage: '(引数が)わ、わかんないっピ.......',
  generate(args, author) {
    if (args.flags.c)
      return `${author}「${args.body.split(' ')[0]}、出して」\n${
        args.body.split(' ')[1]
      }「わ、わかんないっピ.......」`;
    if (args.flags.f)
      return `${author}「${args.body}、出して」\n教員「わ、わかんないっピ.......」`;
    return `教員「${args.body}、出して」\n${author}「わ、わかんないっピ.......」`;
  }
};
