import { expect, it, vi } from 'vitest';

import { DifferenceDetector } from './difference-detector.js';

it('react to edited message', async () => {
  const responder = new DifferenceDetector();
  const fn = vi.fn();
  await responder.on(
    'UPDATE',
    {
      content: 'LGBT',
      sendEphemeralToSameChannel: fn
    },
    {
      content: 'LGTM',
      sendEphemeralToSameChannel: (message) => {
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
      sendEphemeralToSameChannel: fn
    },
    {
      content: `pika
peka
poka
`,
      sendEphemeralToSameChannel: (message) => {
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
      sendEphemeralToSameChannel: fn
    },
    {
      content: `草`,
      sendEphemeralToSameChannel: (message) => {
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
      sendEphemeralToSameChannel: fn
    },
    {
      content: `山陰に無い店
松屋
やよい軒
ロッテリア ロイヤルホスト
サイゼリヤ(鳥取にはある)`,
      sendEphemeralToSameChannel: (message) => {
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
