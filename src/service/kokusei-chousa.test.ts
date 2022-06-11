import { expect, it, vi } from 'vitest';
import { KokuseiChousa } from './kokusei-chousa.js';
import { createMockMessage } from './command-message.js';

it('use case of kokusei-chousa', async () => {
  const responder = new KokuseiChousa({
    allMemberCount(): Promise<number> {
      return Promise.resolve(150);
    },
    botMemberCount(): Promise<number> {
      return Promise.resolve(50);
    }
  });
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['kokusei']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: '***†只今の限界開発鯖の人口†***',
          fields: [
            {
              name: '人間+Bot',
              value: `150人`,
              inline: true
            },
            {
              name: '人類の数',
              value: '100人',
              inline: true
            },
            { name: 'Botの数', value: `50人`, inline: true },
            { name: 'Bot率', value: '33.333%' }
          ]
        });
        return Promise.resolve();
      }
    )
  );
});

it('delete message', async () => {
  const responder = new KokuseiChousa({
    allMemberCount(): Promise<number> {
      return Promise.resolve(100);
    },
    botMemberCount(): Promise<number> {
      return Promise.resolve(50);
    }
  });
  const fn = vi.fn();
  await responder.on(
    'DELETE',
    createMockMessage({
      args: ['kokusei'],
      reply: fn
    })
  );

  expect(fn).not.toHaveBeenCalled();
});
