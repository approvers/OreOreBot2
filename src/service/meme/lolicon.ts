import type { MemeTemplate } from '../../model/meme-template.js';

export const lolicon: MemeTemplate<never, never> = {
  commandNames: ['lolicon'],
  description: 'だから僕は〜を辞めた',
  flagsKeys: [],
  optionsKeys: [],
  errorMessage: 'こるくはロリコンをやめられなかった。',
  generate(args, author) {
    return `だから僕は${args.body}を辞めた - ${author} (Music Video)`;
  }
};
