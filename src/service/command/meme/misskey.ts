import type { MemeTemplate } from '../../../model/meme-template.js';

const positionalKeys = ['lang', 'made_by'] as const;
const misskeyIssueLink =
  '[元ネタ](https://github.com/misskey-dev/misskey/issues/11078)';

export const misskey: MemeTemplate<
  never,
  never,
  (typeof positionalKeys)[number]
> = {
  commandNames: ['misskey'],
  description: `〜は〜製なので将来性が心配\n${misskeyIssueLink}`,
  pageName: 'misskey',
  requiredPositionalKeys: positionalKeys,
  errorMessage: 'はらちょは限界開発鯖製なので将来性が心配',
  generate(args) {
    return `${args.requiredPositionals.lang}は${args.requiredPositionals.made_by}製なので将来性が心配`;
  }
};
