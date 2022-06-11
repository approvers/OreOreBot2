import { emojiOf, waitingJudgingEmoji } from '../model/judging-status.js';
import { expect, it, vi } from 'vitest';
import type { EmbedMessage } from '../model/embed-message.js';
import { JudgingCommand } from './judging.js';
import { createMockMessage } from './command-message.js';

it('use case of jd', async () => {
  const responder = new JudgingCommand({
    sleep: () => Promise.resolve(),
    uniform: () => 2
  });
  const fn = vi.fn<[EmbedMessage]>(() => Promise.resolve());

  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['jd']
      },
      (embed) => {
        expect(embed).toStrictEqual({
          title: '***†HARACHO ONLINE JUDGING SYSTEM†***',
          description: `0 / 5 ${waitingJudgingEmoji}`
        });
        return Promise.resolve({ edit: fn });
      }
    )
  );

  expect(fn).toBeCalledTimes(5);
  for (let i = 0; i < 4; ++i) {
    expect(fn.mock.calls[i][0]).toStrictEqual({
      title: '***†HARACHO ONLINE JUDGING SYSTEM†***',
      description: `${i + 1} / 5 ${waitingJudgingEmoji}`
    });
  }
  expect(fn.mock.calls[4][0]).toStrictEqual({
    title: '***†HARACHO ONLINE JUDGING SYSTEM†***',
    description: `5 / 5 ${emojiOf('AC')}`
  });
});

it('use case of judge', async () => {
  const responder = new JudgingCommand({
    sleep: () => Promise.resolve(),
    uniform: () => 0
  });
  const fn = vi.fn<[EmbedMessage]>(() => Promise.resolve());

  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['judge', '1', 'WWW']
      },
      (embed) => {
        expect(embed).toStrictEqual({
          title: '***†HARACHO ONLINE JUDGING SYSTEM†***',
          description: `0 / 1 ${waitingJudgingEmoji}`
        });
        return Promise.resolve({ edit: fn });
      }
    )
  );

  expect(fn).toBeCalledTimes(1);
  expect(fn.mock.calls[0][0]).toStrictEqual({
    title: '***†HARACHO ONLINE JUDGING SYSTEM†***',
    description: `1 / 1 WWW`
  });
});

it('max number of cases', async () => {
  const responder = new JudgingCommand({
    sleep: () => Promise.resolve(),
    uniform: () => 1
  });

  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['jd', '1']
      },
      (embed) => {
        expect(embed).toStrictEqual({
          title: '***†HARACHO ONLINE JUDGING SYSTEM†***',
          description: `0 / 1 ${waitingJudgingEmoji}`
        });
        return Promise.resolve({ edit: () => Promise.resolve() });
      }
    )
  );
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['jd', '64']
      },
      (embed) => {
        expect(embed).toStrictEqual({
          title: '***†HARACHO ONLINE JUDGING SYSTEM†***',
          description: `0 / 64 ${waitingJudgingEmoji}`
        });
        return Promise.resolve({ edit: () => Promise.resolve() });
      }
    )
  );

  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['jd', '0']
      },
      (embed) => {
        expect(embed).toStrictEqual({
          title: '回数の指定が 1 以上 64 以下の整数じゃないよ。'
        });
        return Promise.resolve({ edit: () => Promise.resolve() });
      }
    )
  );
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['jd', '65']
      },
      (embed) => {
        expect(embed).toStrictEqual({
          title: '回数の指定が 1 以上 64 以下の整数じゃないよ。'
        });
        return Promise.resolve({ edit: () => Promise.resolve() });
      }
    )
  );
});
