import { expect, it, vi } from 'vitest';

import { DeletionRepeater } from './deletion-repeater.js';

const createdDate = () => {
  const now = new Date(2024, 1, 1, 0, 0, 30);
  return now;
};

const deletedDate = () => {
  // createdDateよりも10秒後
  const createdAt = new Date(2024, 1, 1, 0, 0, 40);
  return createdAt;
};

const fastDeletedDate = () => {
  // createdDateよりも1秒後
  const createdAt = new Date(2024, 1, 1, 0, 0, 31);
  return createdAt;
};

it('react to deleted message', async () => {
  const responder = new DeletionRepeater(() => false, deletedDate);
  await responder.on('DELETE', {
    author: 'Baba',
    content: 'Wall Is Stop',
    createdAt: createdDate(),
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
  const responder = new DeletionRepeater(() => false, deletedDate);
  const fn = vi.fn();
  await responder.on('CREATE', {
    author: 'Baba',
    content: 'Wall Is Not Stop',
    createdAt: createdDate(),
    sendEphemeralToSameChannel: fn
  });
  expect(fn).not.toHaveBeenCalled();
});

it("must not react if it's ignore target", async () => {
  const responder = new DeletionRepeater(
    (content) => content === 'Wall Is Stop',
    deletedDate
  );
  const fn = vi.fn();
  await responder.on('DELETE', {
    author: 'Baba',
    content: 'Wall Is Stop',
    createdAt: createdDate(),
    sendEphemeralToSameChannel: fn
  });
  expect(fn).not.toHaveBeenCalled();
});

it("must react if it's not ignore target", async () => {
  const responder = new DeletionRepeater(
    (content) => content === 'Wall Is Stop',
    deletedDate
  );
  await responder.on('DELETE', {
    author: 'Baba',
    content: 'Wall Is Not Stop',
    createdAt: createdDate(),
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
  const responder = new DeletionRepeater(() => false, fastDeletedDate);
  await responder.on('DELETE', {
    author: 'Baba',
    content: 'Wall Is Stop',
    createdAt: createdDate(),
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
