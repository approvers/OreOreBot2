import { type Sheriff, SheriffCommand } from './stfu';
import { type Snowflake } from '../model/id';
import { createMockMessage } from './command-message';

test('use case of stfu', async () => {
  const executeMessage = jest.fn<Promise<void>, [Snowflake, number]>(() =>
    Promise.resolve()
  );
  const sheriff: Sheriff = { executeMessage };
  const responder = new SheriffCommand(sheriff);
  const fn = jest.fn();
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['stfu'],
      reply: fn
    })
  );

  expect(fn).not.toHaveBeenCalled();
  expect(executeMessage).toHaveBeenCalledWith(
    '711127633810817026' as Snowflake,
    50
  );
});

test('delete message', async () => {
  const executeMessage = jest.fn<Promise<void>, [Snowflake, number]>(() =>
    Promise.resolve()
  );
  const sheriff: Sheriff = { executeMessage };
  const responder = new SheriffCommand(sheriff);
  const fn = jest.fn();
  await responder.on(
    'DELETE',
    createMockMessage({
      args: ['stfu'],
      reply: fn
    })
  );

  expect(fn).not.toHaveBeenCalled();
});

test('other command', async () => {
  const executeMessage = jest.fn<Promise<void>, [Snowflake, number]>(() =>
    Promise.resolve()
  );
  const sheriff: Sheriff = { executeMessage };
  const responder = new SheriffCommand(sheriff);
  const fn = jest.fn();
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['sft'],
      reply: fn
    })
  );

  expect(fn).not.toHaveBeenCalled();
});
