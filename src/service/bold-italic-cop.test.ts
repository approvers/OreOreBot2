import { describe, expect, it, vi } from 'vitest';

import { BoldItalicCopReporter } from './bold-italic-cop.js';

describe('bold italic cop', () => {
  const responder = new BoldItalicCopReporter();

  it('reacts', async () => {
    const replyMessage = vi.fn(() => Promise.resolve());
    await responder.on('CREATE', {
      content: '***foge***',
      replyMessage
    });
    expect(replyMessage).toHaveBeenCalledWith({
      content: 'Bold-Italic警察だ!!! <:haracho:684424533997912096>'
    });
  });

  it('reacts to 4 asterisks', async () => {
    const replyMessage = vi.fn(() => Promise.resolve());
    await responder.on('CREATE', {
      content: '****foge****',
      replyMessage
    });
    expect(replyMessage).toHaveBeenCalledWith({
      content: 'Bold-Italic警察だ!!! <:haracho:684424533997912096>'
    });
  });

  it('does not react 4 asterisks on one side', async () => {
    const replyMessage = vi.fn();
    await responder.on('CREATE', {
      content: '****hoge',
      replyMessage
    });
    expect(replyMessage).not.toHaveBeenCalled();
  });

  it('2 asterisk', async () => {
    const replyMessage = vi.fn();
    await responder.on('CREATE', {
      content: '**hoge',
      replyMessage
    });
    expect(replyMessage).not.toHaveBeenCalled();
  });

  it('bold', async () => {
    const replyMessage = vi.fn();
    await responder.on('CREATE', {
      content: '**hoge**',
      replyMessage
    });
    expect(replyMessage).not.toHaveBeenCalled();
  });

  it('delete case', async () => {
    const replyMessage = vi.fn();
    await responder.on('DELETE', {
      content: '***hoge***',
      replyMessage
    });
    expect(replyMessage).not.toHaveBeenCalled();
  });
});
