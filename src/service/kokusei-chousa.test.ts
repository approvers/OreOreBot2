import { KokuseiChousa } from './kokusei-chousa';
import { createMockMessage } from './command-message';

test('use case of kokusei-chousa', async () => {
  const responder = new KokuseiChousa({
    allMemberCount(): Promise<number> {
      return Promise.resolve(100);
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
              name: '人類の数',
              value: `100人`,
              inline: true
            },
            { name: 'Bot数', value: `50人`, inline: true },
            { name: 'Bot率', value: '50.000%', inline: true }
          ]
        });
        return Promise.resolve();
      }
    )
  );
});

test('delete message', async () => {
  const responder = new KokuseiChousa({
    allMemberCount(): Promise<number> {
      return Promise.resolve(100);
    },
    botMemberCount(): Promise<number> {
      return Promise.resolve(50);
    }
  });
  const fn = jest.fn();
  await responder.on(
    'DELETE',
    createMockMessage({
      args: ['kokusei'],
      reply: fn
    })
  );

  expect(fn).not.toHaveBeenCalled();
});
