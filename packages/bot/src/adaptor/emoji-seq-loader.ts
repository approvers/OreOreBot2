import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function loadEmojiSeqYaml(pathComponents: readonly string[]): string {
  return readFileSync(join(...pathComponents), {
    encoding: 'utf-8',
    flag: 'r'
  });
}
