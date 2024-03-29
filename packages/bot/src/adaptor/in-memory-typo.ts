import type { Snowflake } from '../model/id.js';
import type { TypoRepository } from '../service/command/typo-record.js';

export class InMemoryTypoRepository implements TypoRepository {
  private dict = new Map<Snowflake, string[]>();

  private entry(id: Snowflake): string[] {
    if (!this.dict.has(id)) {
      this.dict.set(id, []);
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.dict.get(id)!;
  }

  addTypo(id: Snowflake, newTypo: string): Promise<void> {
    this.entry(id).push(newTypo);
    return Promise.resolve();
  }
  allTyposByDate(id: Snowflake): Promise<readonly string[]> {
    return Promise.resolve(this.entry(id));
  }
  clear(): Promise<void> {
    this.dict = new Map();
    return Promise.resolve();
  }
}
