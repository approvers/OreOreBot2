import type { MemeTemplate } from '../../../model/meme-template.js';

const positionalKeys = ['expected', 'actual'] as const;

export const koume: MemeTemplate<
  never,
  never,
  (typeof positionalKeys)[number]
> = {
  commandNames: ['koume'],
  description: '〜と思ったら〜♪\n\n〜でした〜♪\n\n引数は2つ必要です。',
  requiredPositionalKeys: positionalKeys,
  errorMessage:
    'MEMEを表示しようと思ったら〜♪ 引数が足りませんでした〜♪ チクショー！！',
  generate({ requiredPositionals: { expected, actual } }) {
    // Reason: 構文とコウメ太夫に敬意を払い、元ネタを尊重することから全角スペースを使用したいのでeslintの警告をBANします。
    // eslint-disable-next-line no-irregular-whitespace
    return `${expected}と思ったら〜♪\n\n${actual}でした〜♪\n\nチクショー！！　#まいにちチクショー`;
  }
};
