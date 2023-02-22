import type { MemeTemplate } from '../../../model/meme-template.js';

export const failure: MemeTemplate<never, never> = {
  commandNames: ['failure', 'fail'],
  description: 'それは一般に失敗と言います、ありがとうございます',
  flagsKeys: [],
  optionsKeys: [],
  errorMessage: 'それは一般に引数エラーと言います、ありがとうございます',
  generate(args) {
    return `「${args.body}」\n「それは一般に失敗と言います、ありがとうございます」`;
  }
};
