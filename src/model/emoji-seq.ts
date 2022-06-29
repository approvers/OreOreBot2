import { parse } from 'yaml';

export interface EmojiSeqRaw {
  pattern: string;
  emojisToSend: string[];
}

export class EmojiSeq {
  private readonly predicate: (body: string) => boolean;

  constructor(
    pattern: string,
    public readonly emojisToSend: readonly string[]
  ) {
    if (new Set(emojisToSend).size !== emojisToSend.length) {
      throw new Error(`elements of \`emojisToSend\` must be unique`);
    }
    const regexp = new RegExp(pattern);
    this.predicate = (body) => regexp.test(body);
  }

  shouldReactTo(body: string): boolean {
    return this.predicate(body);
  }
}

export class EmojiSeqSet {
  constructor(private readonly set: EmojiSeq[]) {}

  whatShouldBeReactTo(body: string): readonly string[] | undefined {
    return this.set.find((value) => value.shouldReactTo(body))?.emojisToSend;
  }

  static fromYaml(yamlText: string): EmojiSeqSet {
    const raw = parse(yamlText) as unknown;
    if (raw === null || raw === undefined) {
      throw new Error('yaml must not be null');
    }
    if (!Array.isArray(raw)) {
      throw new Error('yaml must be an array');
    }
    const set: EmojiSeq[] = [];
    (raw as unknown[]).forEach((entry, index) => {
      if (!isEntryEmojiSeq(entry)) {
        throw new Error(`invalid ${index}-th entry`);
      }
      set.push(new EmojiSeq(entry.pattern, entry.emojisToSend));
    });
    return new EmojiSeqSet(set);
  }
}

const isEntryEmojiSeq = (entry: unknown): entry is EmojiSeqRaw => {
  if (typeof entry !== 'object' || entry === null) {
    return false;
  }
  if (!('pattern' in entry && 'emojisToSend' in entry)) {
    return false;
  }
  if (!Array.isArray((entry as EmojiSeqRaw).emojisToSend)) {
    return false;
  }
  if (
    !(entry as EmojiSeqRaw).emojisToSend.every(
      (emoji) => typeof emoji === 'string'
    )
  ) {
    return false;
  }
  return true;
};
