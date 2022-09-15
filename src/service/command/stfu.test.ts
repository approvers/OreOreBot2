import { type Sheriff, SheriffCommand } from './stfu.js';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { Snowflake } from '../../model/id.js';
import { createMockMessage } from './command-message.js';
import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';

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
      createMockMessage(parseStringsOrThrow(['stfu'], responder.schema), fn, {
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
      createMockMessage(
        parseStringsOrThrow(['stfu', '25'], responder.schema),
        fn,
        {
          react
        }
      )
    );

    expect(fn).not.toHaveBeenCalled();
    expect(executeMessage).nthCalledWith(
      25,
      '711127633810817026' as Snowflake,
      50
    );
    expect(react).toHaveBeenCalledWith('👌');
  });
});
