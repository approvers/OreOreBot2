import type { MemeTemplate } from '../../../model/meme-template.js';

const source =
  '[元ネタ](https://twitter.com/yuki_yuigishi/status/1555557259798687744)';

export const moeta: MemeTemplate<never, never> = {
  commandNames: ['moeta', 'yuki'],
  description: `「久留米の花火大会ね、寮から見れたの?」\n「うん ついでに〜が燃えた」\n${source}`,
  flagsKeys: [],
  optionsKeys: [],
  errorMessage: source,
  generate(args) {
    return `「久留米の花火大会ね、寮から見れたの?」\n「うん ついでに${args.body}が燃えた」\n「は?」`;
  }
};
