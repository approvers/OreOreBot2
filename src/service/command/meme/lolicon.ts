import type { MemeTemplate } from '../../../model/meme-template.js';

const positionalKeys = ['retired'] as const;

export const lolicon: MemeTemplate<
  never,
  never,
  (typeof positionalKeys)[number]
> = {
  commandNames: ['lolicon'],
  description: 'だから僕は〜を辞めた',
  requiredPositionalKeys: positionalKeys,
  errorMessage: 'こるくはロリコンをやめられなかった。',
  generate(args, author) {
    return `だから僕は${args.requiredPositionals.retired}を辞めた - ${author} (Music Video)`;
  }
};
