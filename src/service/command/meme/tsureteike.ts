import type { MemeTemplate } from '../../../model/meme-template.js';

export const tsureteike: MemeTemplate<never, never> = {
  commandNames: ['tsureteike', 'hunt'],
  description: `「この中に〜はいるか 連れて行け」\ne.x) \`!tsureteike プログラマ Rustは知っているか? ゲームですか? 錆のこと? 🦀\``,
  flagsKeys: [],
  optionsKeys: [],
  errorMessage: '構文ミスだ、問答無用で連れて行け',
  generate(args) {
    const [option1, option2, option3, option4, option5] = args.body.split(' ');
    const option = {
      target: option1,
      question: option2,
      a: option3,
      b: option4,
      c: option5
    };
    return makeTureteike(option);
  }
};

interface TsureteikeArgs {
  target: string;
  question: string;
  a: string;
  b: string;
  c: string;
}

function makeTureteike(option: TsureteikeArgs) {
  return `「この中に${option.target}はいるか」\nA,B,C「いません」\n「${option.question}」\nA「${option.a}」\nB「${option.b}」\nC「${option.c}」\n「いたぞ、Cを連れて行け」`;
}
