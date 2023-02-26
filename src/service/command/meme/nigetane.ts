import type { MemeTemplate } from '../../../model/meme-template.js';

const template = (inject: string) =>
  `――今、逃げたね。\n逃げたでしょ。\n${inject}から悪くないって、正当化した。\n\n自分がいい子だって言い訳が見つかってよかったね。\nどんな気分？\n\n……手遅れなのは頭（おつむ）からなのかな。\n\nだって、\nいつまでもそのまんまだよ。\n今だって、ずーっとそう。\n\n――ほんとあなたって、自分さえ良ければ良いんだね。`;

const positionalKeys = ['reason'] as const;

export const nigetane: MemeTemplate<
  never,
  never,
  (typeof positionalKeys)[number]
> = {
  commandNames: ['nigetane'],
  description: '… 〜から悪くないって、… (from Arcaea "Final Verdict")',
  docId: 'nigetane',
  requiredPositionalKeys: positionalKeys,
  errorMessage: '……手遅れなのは頭（おつむ）からなのかな。',
  generate: ({ requiredPositionals: { reason } }) => template(reason)
};
