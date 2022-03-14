import { Hukueki } from './hukueki';
import { createMockMessage } from './command-message';

test('use case of hukueki', async () => {
  const responder = new Hukueki();
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['hukueki', 'こるく']
      },
      (message) => {
        expect(message).toStrictEqual({
          description:
            'ねぇ、将来何してるだろうね\n' +
            'こるくはしてないといいね\n' +
            '困らないでよ'
        });
        return Promise.resolve();
      }
    )
  );
});

test('use case of lolicon', async () => {
  const responder = new Hukueki();
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['lolicon', 'こるく'],
        senderName: 'める'
      },
      (message) => {
        expect(message).toStrictEqual({
          description: `だから僕はこるくを辞めた - める (Music Video)`
        });
        return Promise.resolve();
      }
    )
  );
});

test('use case of dousureba', async () => {
  const responder = new Hukueki();
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['dousureba', 'こるく']
      },
      (message) => {
        expect(message).toStrictEqual({
          description: `限界みたいな鯖に住んでるこるくはどうすりゃいいですか？`
        });
        return Promise.resolve();
      }
    )
  );
});

test('args null', async () => {
  const responder = new Hukueki();
  const fn = jest.fn();
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['dousureba'],
      reply: fn
    })
  );
});

test('delete message', async () => {
  const responder = new Hukueki();
  const fn = jest.fn();
  await responder.on(
    'DELETE',
    createMockMessage({
      args: ['hukueki', 'こるく'],
      reply: fn
    })
  );
});
