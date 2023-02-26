import type { MemeTemplate } from '../../../model/meme-template.js';

const positionalKeys = ['course'] as const;

export const web3: MemeTemplate<never, never, (typeof positionalKeys)[number]> =
  {
    commandNames: ['web3'],
    description: '「いちばんやさしい〜の教本」',
    docId: 'web3',
    requiredPositionalKeys: positionalKeys,
    errorMessage: 'TCP/IP、SMTP、HTTPはGoogleやAmazonに独占されています。',
    generate(args) {
      const we3Meme = `「いちばんやさしい${args.requiredPositionals.course}の教本」 - インプレス `;
      return '```\n' + we3Meme + '\n```';
    }
  };
