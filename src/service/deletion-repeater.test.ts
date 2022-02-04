import { DeletionRepeater } from './deletion-repeater';

test('react to deleted message', async () => {
  const responder = new DeletionRepeater();
  await responder.on('DELETE', {
    author: 'Baba',
    content: 'Wall Is Stop',
    sendToSameChannel: (message) => {
      expect(message)
        .toEqual(`Babaさん、メッセージを削除しましたね？私は見ていましたよ。内容も知っています。
\`\`\`
Wall Is Stop
\`\`\``);
      return Promise.resolve();
    }
  });
});

test('must not react', async () => {
  const responder = new DeletionRepeater();
  const fn = jest.fn();
  await responder.on('CREATE', {
    author: 'Baba',
    content: 'Wall Is Not Stop',
    sendToSameChannel: fn
  });
  expect(fn).not.toHaveBeenCalled();
});
