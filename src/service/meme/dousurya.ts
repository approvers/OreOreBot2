import type { MemeTemplate } from '../../model/meme-template';

export const dousurya: MemeTemplate<never, never> = {
  commandNames: ['dousurya', 'dousureba'],
  description: '限界みたいな鯖に住んでる〜はどうすりゃいいですか？',
  flagsKeys: [],
  optionsKeys: [],
  errorMessage: 'どうしようもない。',
  generate(args) {
    return `限界みたいな鯖に住んでる${args.body}はどうすりゃいいですか？`;
  }
};
