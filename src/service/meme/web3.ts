import type { MemeTemplate } from '../../model/meme-template.js';

export const web3: MemeTemplate<never, never> = {
  commandNames: ['web3'],
  description: '「いちばんやさしい〇〇の教本」',
  flagsKeys: [],
  optionsKeys: [],
  errorMessage: 'TCP/IP、SMTP、HTTPはGoogleやAmazonに独占されています。',
  generate(args) {
    const we3Meme = `「いちばんやさしい${args.body}の教本」 - インプレス `;
    return '```\n' + we3Meme + '\n```';
  }
};
