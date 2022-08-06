import { MemeTemplate } from '../../../model/meme-template.js';

export const moeta: MemeTemplate<never, never> = {
  commandNames: ['moeta', 'yuki'],
  description: '久留米の花火大会ね、寮から見れたの?',
  flagsKeys: [],
  optionsKeys: [],
  errorMessage:
    '[元ネタ](https://twitter.com/yuki_yuigishi/status/1555557259798687744)',
  generate(args) {
    return `「久留米の花火大会ね、寮から見れたの?」\n「うん ついでに${args.body}が燃えた」\n「は?」`;
  }
};
