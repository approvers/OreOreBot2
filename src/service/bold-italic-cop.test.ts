import { BoldItalicCopReporter } from './bold-italic-cop';

test('use case of bold-italic-cop', async () => {
  const responder = new BoldItalicCopReporter();
  await responder.on('CREATE', {
    content: '***foge***',
    replyMessage(message: { content: string }): Promise<void> {
      expect(message.content).toStrictEqual(
        'Bold-Italic警察だ!!! <:haracho:684424533997912096>'
      );
      return Promise.resolve();
    }
  });
});

test('4 asterisk of bold-italic-cop', async () => {
  const responder = new BoldItalicCopReporter();
  await responder.on('CREATE', {
    content: '****foge****',
    replyMessage(message: { content: string }): Promise<void> {
      expect(message.content).toStrictEqual(
        'Bold-Italic警察だ!!! <:haracho:684424533997912096>'
      );
      return Promise.resolve();
    }
  });
});

test('4 asterisk', async () => {
  const responder = new BoldItalicCopReporter();
  const fn = jest.fn();
  await responder.on('CREATE', {
    content: '****hoge',
    replyMessage: fn
  });
  expect(fn).not.toHaveBeenCalled();
});

test('2 asterisk', async () => {
  const responder = new BoldItalicCopReporter();
  const fn = jest.fn();
  await responder.on('CREATE', {
    content: '**hoge',
    replyMessage: fn
  });
  expect(fn).not.toHaveBeenCalled();
});

test('bold', async () => {
  const responder = new BoldItalicCopReporter();
  const fn = jest.fn();
  await responder.on('CREATE', {
    content: '**hoge**',
    replyMessage: fn
  });
  expect(fn).not.toHaveBeenCalled();
});

test('delete case', async () => {
  const responder = new BoldItalicCopReporter();
  const fn = jest.fn();
  await responder.on('DELETE', {
    content: '***hoge***',
    replyMessage: fn
  });
  expect(fn).not.toHaveBeenCalled();
});
