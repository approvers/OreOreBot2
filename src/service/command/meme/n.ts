import type { MemeTemplate } from '../../../model/meme-template.js';

export const n: MemeTemplate<never, never> = {
  commandNames: ['n'],
  description: '〜Nった',
  flagsKeys: [],
  optionsKeys: [],
  errorMessage: 'このままだと <@521958252280545280> みたいに留年しちゃう....',
  generate(args) {
    return `${args.body}Nった`;
  }
};
