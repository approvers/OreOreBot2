import type { MemeTemplate } from '../../../model/meme-template.js';

export const nine: MemeTemplate<never, never> = {
  commandNames: ['nine'],
  description: '〇〇は〇〇が9割',
  flagsKeys: [],
  optionsKeys: [],
  errorMessage: '人は引数ミスが9割',
  generate(args) {
    const [option1, option2] = args.body.split(' ');
    return `${option1}は${option2}が9割`;
  }
};
