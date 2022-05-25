import type { MemeTemplate } from '../../model/meme-template';

export const n: MemeTemplate<never, never> = {
  commandNames: ['n'],
  description: '',
  flagsKeys: [],
  optionsKeys: [],
  errorMessage: 'このままだと <@521958252280545280> みたいに留年しちゃう....',
  generate(args) {
    return `${args.body}Nった`;
  }
};
