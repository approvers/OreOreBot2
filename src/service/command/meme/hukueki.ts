import type { MemeTemplate } from '../../../model/meme-template.js';

export const hukueki: MemeTemplate<never, never> = {
  commandNames: ['hukueki'],
  description: '〜はしてないといいね',
  flagsKeys: [],
  optionsKeys: [],
  errorMessage: '服役できなかった。',
  generate(args) {
    return `ねぇ、将来何してるだろうね\n${args.body}はしてないといいね\n困らないでよ`;
  }
};
