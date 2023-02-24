import type { MemeTemplate } from '../../../model/meme-template.js';

const positionalKeys = ['badThing'] as const;

export const hukueki: MemeTemplate<
  never,
  never,
  (typeof positionalKeys)[number]
> = {
  commandNames: ['hukueki'],
  description: 'ねぇ、将来何してるだろうね\n〜はしてないといいね\n困らないでよ',
  requiredPositionalKeys: positionalKeys,
  errorMessage: '服役できなかった。',
  generate(args) {
    return `ねぇ、将来何してるだろうね\n${args.requiredPositionals.badThing}はしてないといいね\n困らないでよ`;
  }
};
