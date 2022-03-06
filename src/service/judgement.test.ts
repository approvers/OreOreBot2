import { EmbedMessage } from '../model/embed-message';
import { createMockMessage } from './command-message';
import { JudgementCommand } from './judgement';

test('use case of jd', async () => {
  const responder = new JudgementCommand({
    sleep: () => Promise.resolve(),
    uniform: () => 2
  });
  const fn = jest.fn<Promise<void>, [EmbedMessage]>(() => Promise.resolve());

  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['jd']
      },
      (embed) => {
        expect(embed).toStrictEqual({
          title: '***†HARACHO ONLINE JUDGEMENT SYSTEM†***',
          description: '0 / 5 WJ'
        });
        return Promise.resolve({ edit: fn });
      }
    )
  );

  expect(fn).toBeCalledTimes(5);
  for (let i = 0; i < 4; ++i) {
    expect(fn.mock.calls[i][0]).toStrictEqual({
      title: '***†HARACHO ONLINE JUDGEMENT SYSTEM†***',
      description: `${i + 1} / 5 WJ`
    });
  }
  expect(fn.mock.calls[4][0]).toStrictEqual({
    title: '***†HARACHO ONLINE JUDGEMENT SYSTEM†***',
    description: `5 / 5 AC`
  });
});

test('use case of judge', async () => {
  const responder = new JudgementCommand({
    sleep: () => Promise.resolve(),
    uniform: () => 0
  });
  const fn = jest.fn<Promise<void>, [EmbedMessage]>(() => Promise.resolve());

  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['judge', '1', 'WA']
      },
      (embed) => {
        expect(embed).toStrictEqual({
          title: '***†HARACHO ONLINE JUDGEMENT SYSTEM†***',
          description: '0 / 1 WJ'
        });
        return Promise.resolve({ edit: fn });
      }
    )
  );

  expect(fn).toBeCalledTimes(1);
  expect(fn.mock.calls[0][0]).toStrictEqual({
    title: '***†HARACHO ONLINE JUDGEMENT SYSTEM†***',
    description: `1 / 1 WA`
  });
});
