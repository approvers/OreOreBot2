import { describe, expect, it } from 'bun:test';

import { EmojiSeq, EmojiSeqSet } from './emoji-seq.js';

describe('EmojiSeq', () => {
  it('throws Error on invalid parameter', () => {
    expect(() => {
      new EmojiSeq('hoge', []);
    }).toThrow('`emojisToSend` must not be empty');
    expect(() => {
      new EmojiSeq('hoge', [
        '<:oi:969853817791320087>',
        '<:oi:969853817791320087>',
        '<:oi:969853817791320087>',
        '<:oi:969853817791320087>'
      ]);
    }).toThrow('elements of `emojisToSend` must be unique');
  });
});

describe('EmojiSeqSet', () => {
  it('validates yaml', () => {
    expect(() => {
      EmojiSeqSet.fromYaml('null');
    }).toThrow('yaml must not be null');
    expect(() => {
      EmojiSeqSet.fromYaml(`
pattern: hoge
emojisToSend:
  - foo
`);
    }).toThrow('yaml must be an array');
    expect(() => {
      EmojiSeqSet.fromYaml(`
- 3.14
`);
    }).toThrow('invalid 0-th entry');
    expect(() => {
      EmojiSeqSet.fromYaml(`
- pattern: fuga
  emojisToSend: 2022-02-02
`);
    }).toThrow('invalid 0-th entry');
    expect(() => {
      EmojiSeqSet.fromYaml(`
- pattern: fuga
  emojisToSend:
    - 120
`);
    }).toThrow('invalid 0-th entry');
    expect(() => {
      EmojiSeqSet.fromYaml(`
- pattern: fuga
  emojisToSend:
    - foo
- pattern: fuga
`);
    }).toThrow('invalid 1-th entry');
  });
});
