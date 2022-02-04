import { DifferenceDetector } from './difference-detector';

test('react to edited message', async () => {
  const responder = new DifferenceDetector();
  const fn = jest.fn();
  await responder.on(
    'UPDATE',
    {
      content: 'LGBT',
      sendToSameChannel: fn
    },
    {
      content: 'LGTM',
      sendToSameChannel: (message) => {
        expect(message).toEqual(`見てたぞ
\`\`\`diff
- LGBT
+ LGTM
\`\`\``);
        return Promise.resolve();
      }
    }
  );
  await responder.on(
    'UPDATE',
    {
      content: `pika
peka
`,
      sendToSameChannel: fn
    },
    {
      content: `pika
peka
poka
`,
      sendToSameChannel: (message) => {
        expect(message).toEqual(`見てたぞ
\`\`\`diff
+ poka
\`\`\``);
        return Promise.resolve();
      }
    }
  );
  await responder.on(
    'UPDATE',
    {
      content: `草
草`,
      sendToSameChannel: fn
    },
    {
      content: `草`,
      sendToSameChannel: (message) => {
        expect(message).toEqual(`見てたぞ
\`\`\`diff
- 草
\`\`\``);
        return Promise.resolve();
      }
    }
  );
  expect(fn).not.toHaveBeenCalled();
});
