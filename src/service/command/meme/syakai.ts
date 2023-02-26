import type { MemeTemplate } from '../../../model/meme-template.js';

const positionalKeys = ['innovation'] as const;

export const syakai: MemeTemplate<
  never,
  never,
  (typeof positionalKeys)[number]
> = {
  commandNames: ['syakai'],
  description: '「首相、～に否定的な考え ― 『社会が変わってしまう』」',
  docId: 'syakai',
  requiredPositionalKeys: positionalKeys,
  errorMessage: '極めて慎重に検討すべき課題だ',
  generate(args) {
    return `「首相、${args.requiredPositionals.innovation}に否定的な考え ― 『社会が変わってしまう』」`;
  }
};
