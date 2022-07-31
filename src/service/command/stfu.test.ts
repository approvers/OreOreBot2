import { type Sheriff, SheriffCommand } from './stfu.js';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Snowflake } from '../../model/id.js';
import { createMockMessage } from './command-message.js';

describe('stfu', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const sheriff: Sheriff = { executeMessage: () => Promise.resolve() };
  const responder = new SheriffCommand(sheriff);

  it('use case of stfu', async () => {
    const executeMessage = vi.spyOn(sheriff, 'executeMessage');
    const fn = vi.fn();
    const react = vi.fn<[string]>(() => Promise.resolve());
    await responder.on(
      'CREATE',
      createMockMessage({
        args: ['stfu'],
        reply: fn,
        react
      })
    );

    expect(fn).not.toHaveBeenCalled();
    expect(executeMessage).toHaveBeenCalledWith(
      '711127633810817026' as Snowflake,
      50
    );
    expect(react).toHaveBeenCalledWith('👌');
  });

  it('executes specified times', async () => {
    const executeMessage = vi.spyOn(sheriff, 'executeMessage');
    const fn = vi.fn();
    const react = vi.fn<[string]>(() => Promise.resolve());
    await responder.on(
      'CREATE',
      createMockMessage({
        args: ['stfu', '25'],
        reply: fn,
        react
      })
    );

    expect(fn).not.toHaveBeenCalled();
    expect(executeMessage).nthCalledWith(
      25,
      '711127633810817026' as Snowflake,
      50
    );
    expect(react).toHaveBeenCalledWith('👌');
  });

  it('errors invalid specification', async () => {
    const executeMessage = vi.spyOn(sheriff, 'executeMessage');
    const fn = vi.fn();
    const react = vi.fn<[string]>(() => Promise.resolve());
    await responder.on(
      'CREATE',
      createMockMessage({
        args: ['stfu', '51'],
        reply: fn,
        react
      })
    );

    expect(fn).toHaveBeenCalledWith({
      title: '引数の範囲エラー',
      description: '1 以上 50 以下の整数を指定してね。'
    });
    expect(executeMessage).not.toHaveBeenCalled();
    expect(react).not.toHaveBeenCalled();
  });

  it('delete message', async () => {
    const executeMessage = vi.spyOn(sheriff, 'executeMessage');
    const fn = vi.fn();
    await responder.on(
      'DELETE',
      createMockMessage({
        args: ['stfu'],
        reply: fn
      })
    );

    expect(fn).not.toHaveBeenCalled();
    expect(executeMessage).not.toHaveBeenCalled();
  });

  it('other command', async () => {
    const executeMessage = vi.spyOn(sheriff, 'executeMessage');
    const fn = vi.fn();
    await responder.on(
      'CREATE',
      createMockMessage({
        args: ['sft'],
        reply: fn
      })
    );

    expect(fn).not.toHaveBeenCalled();
    expect(executeMessage).not.toHaveBeenCalled();
  });
});
