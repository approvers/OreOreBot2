import type { MemeTemplate } from '../../../model/meme-template.js';

export const koume: MemeTemplate<never, never> = {
  commandNames: ['koume'],
  description: 'チクショー！！ `#毎日チクショー`',
  flagsKeys: [],
  optionsKeys: [],
  errorMessage:
    'MEMEを表示しようと思ったら〜♪ 引数が足りませんでした〜♪ チクショー！！',
  generate(args) {
    const [option1, option2] = args.body.split(' ');
    return `${option1}と思ったら〜♪\n${option2}でした〜♪\nチクショー！！ #まいにちチクショー`;
  }
};
