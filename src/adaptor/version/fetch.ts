import type { VersionFetcher } from '../../service/version.js';
import { readFileSync } from 'node:fs';

export class GenVersionFetcher implements VersionFetcher {
  private _version: string;

  constructor() {
    this._version = readFileSync('./build/version.txt')
      .toString('utf-8', 0, 100)
      .trim();
  }

  get version(): string {
    return this._version;
  }
}
