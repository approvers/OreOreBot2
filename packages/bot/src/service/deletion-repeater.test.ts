import { expect, it, vi } from 'vitest';

import { DeletionRepeater } from './deletion-repeater.js';

it('react to deleted message', async () => {
  const now = new Date();
  const createdAt = new Date();
  createdAt.setSeconds(createdAt.getSeconds() - 10);

  const responder = new DeletionRepeater(
    () => false,
    () => now
  );
  await responder.on('DELETE', {
    author: 'Baba',
    content: 'Wall Is Stop',
    createdAt: createdAt,
    sendEphemeralToSameChannel: (message) => {
      expect(message)
        .toEqual(`Babaさん、メッセージを削除しましたね？私は見ていましたよ。内容も知っています。
\`\`\`
Wall Is Stop
\`\`\``);
      return Promise.resolve();
    }
  });
});

it('must not react', async () => {
  const now = new Date();
  const createdAt = new Date();
  createdAt.setSeconds(now.getSeconds() - 10);

  const responder = new DeletionRepeater(
    () => false,
    () => now
  );
  const fn = vi.fn();
  await responder.on('CREATE', {
    author: 'Baba',
    content: 'Wall Is Not Stop',
    createdAt: createdAt,
    sendEphemeralToSameChannel: fn
  });
  expect(fn).not.toHaveBeenCalled();
});

it("must not react if it's ignore target", async () => {
  const now = new Date();
  const createdAt = new Date();
  createdAt.setSeconds(createdAt.getSeconds() - 10);

  const responder = new DeletionRepeater(
    (content) => content === 'Wall Is Stop',
    () => now
  );
  const fn = vi.fn();
  await responder.on('DELETE', {
    author: 'Baba',
    content: 'Wall Is Stop',
    createdAt: createdAt,
    sendEphemeralToSameChannel: fn
  });
  expect(fn).not.toHaveBeenCalled();
});

it("must react if it's not ignore target", async () => {
  const now = new Date();
  const createdAt = new Date();
  createdAt.setSeconds(createdAt.getSeconds() - 10);

  const responder = new DeletionRepeater(
    (content) => content === 'Wall Is Stop',
    () => now
  );
  await responder.on('DELETE', {
    author: 'Baba',
    content: 'Wall Is Not Stop',
    createdAt: createdAt,
    sendEphemeralToSameChannel: (message) => {
      expect(message)
        .toEqual(`Babaさん、メッセージを削除しましたね？私は見ていましたよ。内容も知っています。
\`\`\`
Wall Is Not Stop
\`\`\``);
      return Promise.resolve();
    }
  });
});

it("react to deleted message if it's too fast", async () => {
  const now = new Date();
  const createdAt = new Date();
  createdAt.setSeconds(now.getSeconds() - 1);

  const responder = new DeletionRepeater(
    () => false,
    () => now
  );
  await responder.on('DELETE', {
    author: 'Baba',
    content: 'Wall Is Stop',
    createdAt: createdAt,
    sendEphemeralToSameChannel: (message) => {
      expect(message)
        .toEqual(`Babaさんの恐ろしく早いメッセージの削除。私じゃなきゃ見逃していましたよ。
\`\`\`
Wall Is Stop
\`\`\``);
      return Promise.resolve();
    }
  });
});
