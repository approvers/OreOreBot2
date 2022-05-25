import type { MemeTemplate } from '../../model/meme-template';

export const dousurya: MemeTemplate<never, never> = {
  commandNames: ['dousurya'],
  description: '',
  flagsKeys: [],
  optionsKeys: [],
  errorMessage: 'どうしようもない。',
  generate(args) {
    return `限界みたいな鯖に住んでる${args.body}はどうすりゃいいですか？`;
  }
};
