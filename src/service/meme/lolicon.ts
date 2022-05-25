import type { MemeTemplate } from '../../model/meme-template';

export const lolicon: MemeTemplate<never, never> = {
  commandNames: ['lolicon'],
  description: '',
  flagsKeys: [],
  optionsKeys: [],
  errorMessage: 'こるくはロリコンをやめられなかった。',
  generate(args, author) {
    return `だから僕は${args.body}を辞めた - ${author} (Music Video)`;
  }
};
