import type { MemeTemplate } from '../../model/meme-template.js';

const template = (inject: string) =>
  `--今、逃げたね。 逃げたでしょ。\n${inject}から悪くないって、正当化した。\n自分がいい子だって言い訳が見つかってよかったね。\nどんな気分？\n\n……手遅れなのは頭（おつむ）からなのかな。\nだって、 いつまでもそのまんまだよ。\n今だって、ずーっとそう。\n\n――ほんとあなたって、自分さえ良ければ良いんだね。`;

export const nigetane: MemeTemplate<never, never> = {
  commandNames: ['nigetane'],
  description: 'Arcaeaの光が自身を断罪したセリフ, 通称逃げたねコピペ.',
  flagsKeys: [],
  optionsKeys: [],
  errorMessage: '……手遅れなのは頭（おつむ）からなのかな。',
  generate: ({ body }) => template(body)
};
