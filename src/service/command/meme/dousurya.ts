import type { MemeTemplate } from '../../../model/meme-template.js';

const positionalKeys = ['living'] as const;

export const dousurya: MemeTemplate<
  never,
  never,
  (typeof positionalKeys)[number]
> = {
  commandNames: ['dousurya', 'dousureba'],
  description: '限界みたいな鯖に住んでる〜はどうすりゃいいですか？',
  docId: 'dousurya',
  requiredPositionalKeys: positionalKeys,
  errorMessage: 'どうしようもない。',
  generate(args) {
    return `限界みたいな鯖に住んでる${args.requiredPositionals.living}はどうすりゃいいですか？`;
  }
};
