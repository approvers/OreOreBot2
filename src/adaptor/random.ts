import { RandomGenerator } from '../service/party';

export class MathRandomGenerator implements RandomGenerator {
  minutes(): number {
    return Math.floor(Math.random() * 60);
  }

  pick<T>(array: readonly T[]): T {
    return [...array].sort(() => Math.random() * 2 - 1)[0];
  }
}
