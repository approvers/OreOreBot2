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
    // Reason: 構文とコウメ太夫に敬意を払い、元ネタを尊重することから全角スペースを使用したいのでeslintの警告をBANします。
    // eslint-disable-next-line no-irregular-whitespace
    return `${option1}と思ったら〜♪\n\n${option2}でした〜♪\n\nチクショー！！　#まいにちチクショー`;
  }
};
