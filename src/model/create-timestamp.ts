export function createTimestamp(targetDate: Date | null | undefined) {
  if (!targetDate) {
    return '情報なし';
  }

  const unixTime = Math.floor(targetDate.getTime() / 1000);
  return `<t:${unixTime}>(<t:${unixTime}:R>)`;
}
