import type { MemeTemplate } from '../../../model/meme-template.js';

const positionalKeys = [
  'target',
  'question',
  'aAnswer',
  'bAnswer',
  'cAnswer'
] as const;

export const tsureteike: MemeTemplate<
  never,
  never,
  (typeof positionalKeys)[number]
> = {
  commandNames: ['tsureteike', 'hunt'],
  description:
    '「この中に〜はいるか 連れて行け」\nex.) `!tsureteike プログラマ Rustは知っているか? ゲームですか? 錆のこと? 🦀`',
  requiredPositionalKeys: positionalKeys,
  errorMessage: '構文ミスだ、問答無用で連れて行け',
  generate({ requiredPositionals }) {
    return makeTureteike(requiredPositionals);
  }
};

function makeTureteike({
  target,
  question,
  aAnswer: a,
  bAnswer: b,
  cAnswer: c
}: Record<(typeof positionalKeys)[number], string>) {
  return `「この中に${target}はいるか」\nA,B,C「いません」\n「${question}」\nA「${a}」\nB「${b}」\nC「${c}」\n「いたぞ、Cを連れて行け」`;
}
