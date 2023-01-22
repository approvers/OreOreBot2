import pkg from '../../../package.json' assert { type: 'json' };
import type { VersionFetcher } from '../../service/command/version.js';

export class GenVersionFetcher implements VersionFetcher {
  public readonly version: string;

  constructor() {
    this.version = pkg.version;
  }
}
