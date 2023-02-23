import type { MemeTemplate } from '../../../model/meme-template.js';

const sourceLink = 'https://dic.nicovideo.jp/id/5671528';

const failureOption = ['k'] as const;

export const failure: MemeTemplate<never, (typeof failureOption)[number]> = {
  commandNames: ['failure', 'fail'],
  description: `「〜〜〜」\n「わかりました。それは一般に失敗と言います、ありがとうございます」\n[元ネタ](${sourceLink})`,
  flagsKeys: [],
  optionsKeys: failureOption,
  errorMessage:
    '「わかりました。それは一般に引数エラーと言います、ありがとうございます」',
  generate(args) {
    const failureArgs = {
      explanation: args.body,
      impoliteness: args.options.k ?? '失敗'
    };
    return `「${failureArgs.explanation}」\n「わかりました。それは一般に${failureArgs.impoliteness}と言います、ありがとうございます」`;
  }
};
