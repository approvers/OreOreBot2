import type { MemeTemplate } from '../../../model/meme-template.js';

const positionalKeys = ['subject', 'entity'] as const;

export const nine: MemeTemplate<never, never, (typeof positionalKeys)[number]> =
  {
    commandNames: ['nine'],
    description: '〇〇は〇〇が9割',
    pageName: 'nine',
    requiredPositionalKeys: positionalKeys,
    errorMessage: '人は引数ミスが9割',
    generate({ requiredPositionals: { subject, entity } }) {
      return `${subject}は${entity}が9割`;
    }
  };
