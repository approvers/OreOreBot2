import type { MemeTemplate } from '../../../model/meme-template.js';

const source =
  '[元ネタ](https://twitter.com/yuki_yuigishi/status/1555557259798687744)';

const positionalKeys = ['burnt'] as const;

export const moeta: MemeTemplate<
  never,
  never,
  (typeof positionalKeys)[number]
> = {
  commandNames: ['moeta', 'yuki'],
  description: `「久留米の花火大会ね、寮から見れたの?」\n「うん ついでに〜が燃えた」\n${source}`,
  requiredPositionalKeys: positionalKeys,
  errorMessage: source,
  generate(args) {
    return `「久留米の花火大会ね、寮から見れたの?」\n「うん ついでに${args.requiredPositionals.burnt}が燃えた」\n「は?」`;
  }
};
