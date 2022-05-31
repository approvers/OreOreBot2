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
      return '<:CE:981118707264811018>';
    case 'MLE':
      return '<:MLE:981118706916675614>';
    case 'TLE':
      return '<:TLE:714879875969712193>';
    case 'RE':
      return '<:RE:981118707222872084>';
    case 'OLE':
      return '<:OLE:981118707088637962>';
    case 'IE':
      return '<:IE:981118706920865802>';
    case 'WA':
      return '<:WA:714879905111736320>';
    case 'AC':
      return '<:AC:714879672353161236>';
  }
}

export const waitingJudgingEmoji = '<:WJ:714879935256461355>';
