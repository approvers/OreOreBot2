import type { VersionFetcher } from '../../service/version.js';
import { readFileSync } from 'node:fs';

export class GenVersionFetcher implements VersionFetcher {
  public readonly version: string;

  constructor() {
    this.version = readFileSync('./build/version.txt')
      .toString('utf-8', 0, 100)
      .trim();
  }
}
