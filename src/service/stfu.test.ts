import { type Sheriff, SheriffCommand } from './stfu';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { type Snowflake } from '../model/id';
import { createMockMessage } from './command-message';

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
