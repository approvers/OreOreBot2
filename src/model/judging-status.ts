export const judgingStatuses = [
  'CE',
  'MLE',
  'TLE',
  'RE',
  'OLE',
  'IE',
  'WA',
  'AC'
] as const;

export type JudgingStatus = typeof judgingStatuses[number];

export function isJudgingStatus(str: string): str is JudgingStatus {
  return (judgingStatuses as readonly string[]).includes(str);
}

export function hasNoTestCases(status: JudgingStatus): boolean {
  return status === 'CE';
}

export function emojiOf(status: JudgingStatus): string {
  switch (status) {
    case 'CE':
      return '<:ce:981090343594360842>';
    case 'MLE':
      return '<:mle:981090343606956082>';
    case 'TLE':
      return '<:tle:981090343669862420>';
    case 'RE':
      return '<:re:981090343506305055>';
    case 'OLE':
      return '<:ole:981090343476953099>';
    case 'IE':
      return '<:ie:981090343644717106>';
    case 'WA':
      return '<:wa:981090344009609236>';
    case 'AC':
      return '<:ac:981090343590166608>';
  }
}

export const waitingJudgingEmoji = '<:wj:981095156575002634>';
