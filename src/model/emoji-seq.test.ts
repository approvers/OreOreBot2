import { EmojiSeq, EmojiSeqSet } from './emoji-seq.js';
import { describe, expect, it } from 'vitest';

describe('EmojiSeq', () => {
  it('throws Error on invalid parameter', () => {
    expect(() => {
      new EmojiSeq('hoge', []);
    }).throws('`emojisToSend` must not be empty');
    expect(() => {
      new EmojiSeq('hoge', [
        '<:oi:969853817791320087>',
        '<:oi:969853817791320087>',
        '<:oi:969853817791320087>',
        '<:oi:969853817791320087>'
      ]);
    }).throws('elements of `emojisToSend` must be unique');
  });
});

describe('EmojiSeqSet', () => {
  it('validates yaml', () => {
    expect(() => {
      EmojiSeqSet.fromYaml('null');
    }).throws('yaml must not be null');
    expect(() => {
      EmojiSeqSet.fromYaml(`
pattern: hoge
emojisToSend:
  - foo
`);
    }).throws('yaml must be an array');
    expect(() => {
      EmojiSeqSet.fromYaml(`
- 3.14
`);
    }).throws('invalid 0-th entry');
    expect(() => {
      EmojiSeqSet.fromYaml(`
- pattern: fuga
  emojisToSend: 2022-02-02
`);
    }).throws('invalid 0-th entry');
    expect(() => {
      EmojiSeqSet.fromYaml(`
- pattern: fuga
  emojisToSend:
    - 120
`);
    }).throws('invalid 0-th entry');
    expect(() => {
      EmojiSeqSet.fromYaml(`
- pattern: fuga
  emojisToSend:
    - foo
- pattern: fuga
`);
    }).throws('invalid 1-th entry');
  });
});
