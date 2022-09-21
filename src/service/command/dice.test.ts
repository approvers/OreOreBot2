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

  it('case of 101D20', async () => {
    const roll = vi.spyOn(diceQueen, 'roll');
    const fn = vi.fn();

    await diceCommand.on(
      createMockMessage(
        parseStringsOrThrow(['dice', '101D20'], diceCommand.schema),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: '引数が範囲外だよ',
      description: 'ダイスは非負整数で100面20個以下にしてね。'
    });
    expect(roll).toBeCalledTimes(0);
  });

  it('case of 100D21', async () => {
    const roll = vi.spyOn(diceQueen, 'roll');
    const fn = vi.fn();

    await diceCommand.on(
      createMockMessage(
        parseStringsOrThrow(['dice', '100D21'], diceCommand.schema),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: '引数が範囲外だよ',
      description: 'ダイスは非負整数で100面20個以下にしてね。'
    });
    expect(roll).toBeCalledTimes(0);
  });

  it('case of 0D6', async () => {
    const roll = vi.spyOn(diceQueen, 'roll');
    const fn = vi.fn();

    await diceCommand.on(
      createMockMessage(
        parseStringsOrThrow(['dice', '0D6'], diceCommand.schema),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: '引数が範囲外だよ',
      description: 'ダイスは非負整数で100面20個以下にしてね。'
    });
    expect(roll).toBeCalledTimes(0);
  });

  it('case of 10D6d50', async () => {
    const roll = vi.spyOn(diceQueen, 'roll');
    const fn = vi.fn();

    await diceCommand.on(
      createMockMessage(
        parseStringsOrThrow(['dice', '10D6d50'], diceCommand.schema),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'コマンド形式エラー',
      description:
        '引数の形は`<num>d<num>`をとる必要があるよ。`<num>`は非負整数にしてね。'
    });
    expect(roll).toBeCalledTimes(0);
  });
});
