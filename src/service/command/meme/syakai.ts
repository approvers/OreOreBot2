import type { MemeTemplate } from '../../../model/meme-template.js';

export const syakai: MemeTemplate<never, never> = {
  commandNames: ['syakai'],
  description: '「首相、～に否定的な考え ― 『社会が変わってしまう』」',
  flagsKeys: [],
  optionsKeys: [],
  errorMessage: '極めて慎重に検討すべき課題だ',
  generate(args) {
    return `「首相、${args.body}に否定的な考え ― 『社会が変わってしまう』」`;
  }
};
