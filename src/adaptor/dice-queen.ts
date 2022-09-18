import type { DiceQueen } from '../service/command/dice.js';

export interface RandomGenerator {
  uniform(from: number, to: number): number;
}

export class GenDiceQueen implements DiceQueen {
  constructor(private readonly rng: RandomGenerator) {}

  roll(faces: number, HowManyRoll: number): Array<number> {
    const diceLog: number[] = [];
    for (let i = 0; i < HowManyRoll; ++i) {
      diceLog.push(this.rng.uniform(1, faces));
    }

    return diceLog;
  }
}
