import type { MemeTemplate } from '../../../model/meme-template.js';

const sourceLink = 'https://dic.nicovideo.jp/id/5671528';

export const failure: MemeTemplate<never, never> = {
  commandNames: ['failure', 'fail'],
  description: `「〜〜〜」\n「わかりました。それは一般に失敗と言います、ありがとうございます」\n[元ネタ](${sourceLink})'`,
  flagsKeys: [],
  optionsKeys: [],
  errorMessage:
    '「わかりました。それは一般に引数エラーと言います、ありがとうございます」',
  generate(args) {
    return `「${args.body}」\n「わかりました。それは一般に失敗と言います、ありがとうございます」`;
  }
};
