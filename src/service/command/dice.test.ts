import { DiceCommand, DiceQueen } from './dice.js';
import { describe, expect, it, vi } from 'vitest';

import { createMockMessage } from './command-message.js';
import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';

describe('dice', () => {
  const diceQueen: DiceQueen = {
    roll: (face, num) => [...new Array<undefined>(face)].map(() => num)
  };
  const diceCommand = new DiceCommand(diceQueen);

  it('case of 1d6', async () => {
    const roll = vi.spyOn(diceQueen, 'roll');
    const fn = vi.fn();

    await diceCommand.on(
      createMockMessage(
        parseStringsOrThrow(['dice', '1d6'], diceCommand.schema),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: '運命のダイスロール！',
      description: '1d6 => 6'
    });
    expect(roll).toHaveBeenCalledOnce();
  });

  it('case of defaultValue', async () => {
    const roll = vi.spyOn(diceQueen, 'roll');
    const fn = vi.fn();

    await diceCommand.on(
      createMockMessage(parseStringsOrThrow(['dice'], diceCommand.schema), fn)
    );

    expect(fn).toHaveBeenCalledWith({
      title: '運命のダイスロール！',
      description: '1d100 => 100'
    });
    expect(roll).toHaveBeenCalledOnce();
  });

  it('case of 100D500', async () => {
    const roll = vi.spyOn(diceQueen, 'roll');
    const fn = vi.fn();

    await diceCommand.on(
      createMockMessage(
        parseStringsOrThrow(['dice', '100D500'], diceCommand.schema),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: '引数が大きすぎるよ',
      description: 'ダイスは100面20個以下、最大値が2000までの処理にしてね。'
    });
    expect(roll).toBeCalledTimes(0);
  });
});
