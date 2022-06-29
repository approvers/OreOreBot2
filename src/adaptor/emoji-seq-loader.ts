import { join } from 'node:path';
import { readFileSync } from 'node:fs';

export function loadEmojiSeqYaml(pathComponents: readonly string[]): string {
  return readFileSync(join(...pathComponents), {
    encoding: 'utf-8',
    flag: 'r'
  });
}
