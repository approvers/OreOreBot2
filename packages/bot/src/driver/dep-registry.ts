export type Dep0 = {
  readonly type: unknown;
} & symbol;
export type GetDep0<S> = S extends Dep0 ? S['type'] : never;

export class DepRegistry {
  #dict = new Map<symbol, unknown>();

  add<K extends Dep0>(key: K, value: GetDep0<K>): void {
    if (this.#dict.has(key)) {
      throw new Error(`exists on key: ${key.description}`);
    }
    this.#dict.set(key, value);
  }

  has(key: symbol): boolean {
    return this.#dict.has(key);
  }

  get<K extends Dep0>(key: K): GetDep0<K> {
    if (!this.#dict.has(key)) {
      throw new Error(`not found for key: ${key.description}`);
    }
    return this.#dict.get(key) as GetDep0<K>;
  }

  remove(key: symbol): void {
    this.#dict.delete(key);
  }

  clear(): void {
    this.#dict.clear();
  }
}
