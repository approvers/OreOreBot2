import { expect, it, vi } from 'vitest';

import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';
import { DepRegistry } from '../../driver/dep-registry.js';
import type { EmbedMessage } from '../../model/embed-message.js';
import { emojiOf, waitingJudgingEmoji } from '../../model/judging-status.js';
import {
  dummyRandomGenerator,
  randomGeneratorKey
} from '../../model/random-generator.js';
import { createMockMessage } from './command-message.js';
import { JudgingCommand } from './judging.js';

it('use case of jd', async () => {
  const reg = new DepRegistry();
  reg.add(randomGeneratorKey, { ...dummyRandomGenerator, uniform: () => 2 });
  const responder = new JudgingCommand(reg);
  const fn = vi.fn<[EmbedMessage], Promise<void>>();

  await responder.on(
    createMockMessage(
      parseStringsOrThrow(['jd'], responder.schema),
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
  const reg = new DepRegistry();
  reg.add(randomGeneratorKey, { ...dummyRandomGenerator, uniform: () => 0 });
  const responder = new JudgingCommand(reg);
  const fn = vi.fn<[EmbedMessage], Promise<void>>();

  await responder.on(
    createMockMessage(
      parseStringsOrThrow(['judge', '1', 'WWW'], responder.schema),
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
  const reg = new DepRegistry();
  reg.add(randomGeneratorKey, { ...dummyRandomGenerator, uniform: () => 1 });
  const responder = new JudgingCommand(reg);

  await responder.on(
    createMockMessage(
      parseStringsOrThrow(['jd', '1'], responder.schema),
      (embed) => {
        expect(embed).toStrictEqual({
          title: '***†HARACHO ONLINE JUDGING SYSTEM†***',
          description: `0 / 1 ${waitingJudgingEmoji}`
        });
      }
    )
  );
  await responder.on(
    createMockMessage(
      parseStringsOrThrow(['jd', '64'], responder.schema),
      (embed) => {
        expect(embed).toStrictEqual({
          title: '***†HARACHO ONLINE JUDGING SYSTEM†***',
          description: `0 / 64 ${waitingJudgingEmoji}`
        });
      }
    )
  );
});
