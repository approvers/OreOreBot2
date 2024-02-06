export interface Dep0 {
  readonly type: unknown;
}
export interface Dep1 extends Dep0 {
  readonly param1: unknown;
}

export type Apply1<S, A1> = S & { param1: A1 };

export type GetDep0<S> = S extends Dep0 ? S['type'] : never;
export type GetDep1<S, A1> = S extends Dep1 ? Apply1<S, A1>['type'] : never;

export class DepRegistry {
  #dict = new Map<symbol, unknown>();

  add<K extends Dep0>(key: K, value: GetDep0<K>): void;
  add<K extends Dep1, A1>(key: K, value: GetDep1<K, A1>): void;
  add(key: symbol, value: never): void {
    if (this.#dict.has(key)) {
      throw new Error(`exists on key: ${key.description}`);
    }
    this.#dict.set(key, value);
  }

  has(key: symbol): boolean {
    return this.#dict.has(key);
  }

  get<K extends Dep0>(key: K): GetDep0<K>;
  get<K extends Dep1, A1>(key: K): GetDep1<K, A1>;
  get(key: symbol): never {
    if (!this.#dict.has(key)) {
      throw new Error(`not found for key: ${key.description}`);
    }
    return this.#dict.get(key) as never;
  }

  remove(key: symbol): void {
    this.#dict.delete(key);
  }

  clear(): void {
    this.#dict.clear();
  }
}
