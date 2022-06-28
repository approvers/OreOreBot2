export class EmojiSeq {
  private readonly predicate: (body: string) => boolean;

  constructor(
    pattern: string | RegExp,
    public readonly emojisToSend: readonly string[]
  ) {
    if (new Set(emojisToSend).size !== emojisToSend.length) {
      throw new Error(`elements of \`emojisToSend\` must be unique`);
    }
    this.predicate =
      typeof pattern === 'string'
        ? (body) => body.includes(pattern)
        : (body) => pattern.test(body);
  }

  shouldReactTo(body: string): boolean {
    return this.predicate(body);
  }
}
