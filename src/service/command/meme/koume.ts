import type { MemeTemplate } from '../../../model/meme-template.js';

export const koume: MemeTemplate<never, never> = {
  commandNames: ['koume'],
  description: 'チクショー！！ `#毎日チクショー`',
  flagsKeys: [],
  optionsKeys: [],
  errorMessage:
    'MEMEを表示しようと思ったら〜♪ 引数が足りませんでした〜♪ チクショー！！',
  generate(args) {
    // TODO: 改行する
    const option1 = args.body.split(' ')[0];
    const option2 = args.body.split(' ')[1];
    return `${option1}と思ったら〜♪ ${option2}でした〜♪ チクショー！！`;
  }
};
