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
      return '<:CE:981112214633218088>';
    case 'MLE':
      return '<:MLE:981112214620610610>';
    case 'TLE':
      return '<:TLE:714879875969712193>';
    case 'RE':
      return '<:RE:981112215044255764>';
    case 'OLE':
      return '<:OLE:981112214691905536>';
    case 'IE':
      return '<:IE:981112214436085820>';
    case 'WA':
      return '<:WA:714879905111736320>';
    case 'AC':
      return '<:AC:714879672353161236>';
  }
}

export const waitingJudgingEmoji = '<:WJ:714879935256461355>';
