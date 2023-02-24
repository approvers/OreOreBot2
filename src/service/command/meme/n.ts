import type { MemeTemplate } from '../../../model/meme-template.js';

const positionalKeys = ['context'] as const;

export const n: MemeTemplate<never, never, (typeof positionalKeys)[number]> = {
  commandNames: ['n'],
  description: '〜Nった',
  requiredPositionalKeys: positionalKeys,
  errorMessage: 'このままだと <@521958252280545280> みたいに留年しちゃう....',
  generate(args) {
    return `${args.requiredPositionals.context}Nった`;
  }
};
