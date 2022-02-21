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

  await responder.on(
    'UPDATE',
    {
      content: `山陰に無い店
松屋
やよい軒
ロッテリア ロイヤルホスト`,
      sendToSameChannel: fn
    },
    {
      content: `山陰に無い店
松屋
やよい軒
ロッテリア ロイヤルホスト
サイゼリヤ(鳥取にはある)`,
      sendToSameChannel: (message) => {
        expect(message).toEqual(`見てたぞ
\`\`\`diff
+ サイゼリヤ(鳥取にはある)
\`\`\``);
        return Promise.resolve();
      }
    }
  );
  expect(fn).not.toHaveBeenCalled();
});
