import { DebugCommand, MessageRepository } from './debug.js';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Snowflake } from '../../model/id.js';
import { createMockMessage } from './command-message.js';

describe('debug', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const repo: MessageRepository = {
    getMessageContent: () => Promise.resolve(undefined)
  };
  const responder = new DebugCommand(repo);

  it('outputs debug format', async () => {
    const getMessageContent = vi
      .spyOn(repo, 'getMessageContent')
      .mockImplementation(() => Promise.resolve('š°ļø Hoge'));
    const reply = vi.fn(() => Promise.resolve());
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['debug', '1423523'],
          senderChannelId: '8623233' as Snowflake
        },
        reply
      )
    );
    expect(getMessageContent).toHaveBeenCalledWith('8623233', '1423523');
    expect(reply).toHaveBeenCalledWith({
      title: 'ćććć°åŗå',
      description: '```\nš°ļø Hoge\n```'
    });
  });

  it('replaces triple back quotes', async () => {
    const getMessageContent = vi
      .spyOn(repo, 'getMessageContent')
      .mockImplementation(() =>
        Promise.resolve(`\`\`\`js
console.log(\`Hello, \${name}!\`);
\`\`\``)
      );
    const reply = vi.fn(() => Promise.resolve());
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['debug', '1423523'],
          senderChannelId: '8623233' as Snowflake
        },
        reply
      )
    );
    expect(getMessageContent).toHaveBeenCalledWith('8623233', '1423523');
    expect(reply).toHaveBeenCalledWith({
      title: 'ćććć°åŗå',
      description: `\`\`\`
'''js
console.log(\`Hello, \${name}!\`);
'''
\`\`\``,
      footer:
        "äøé£ē¶ć® ` (ćććÆćÆć©ć¼ć) ćÆ ' (ć·ć³ć°ć«ćÆć©ć¼ć) ć«ē½®ęćć¦ćććć"
    });
  });

  it('errors on message not found', async () => {
    const getMessageContent = vi.spyOn(repo, 'getMessageContent');
    const reply = vi.fn(() => Promise.resolve());
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['debug', '1423523'],
          senderChannelId: '8623233' as Snowflake
        },
        reply
      )
    );
    expect(getMessageContent).toHaveBeenCalledWith('8623233', '1423523');
    expect(reply).toHaveBeenCalledWith({
      title: 'ęå®ć®ć”ćć»ć¼ćøćč¦ć¤ćććŖćć£ćć',
      description: 'ćć®ć”ćć»ć¼ćøććć®ćć£ć³ćć«ć«ćććć©ććē¢ŗčŖćć¦ć­ć'
    });
  });

  it('does not react to another command', async () => {
    const getMessageContent = vi.spyOn(repo, 'getMessageContent');
    const reply = vi.fn(() => Promise.resolve());
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['party']
        },
        reply
      )
    );
    await responder.on(
      'DELETE',
      createMockMessage(
        {
          args: ['party']
        },
        reply
      )
    );
    expect(getMessageContent).not.toHaveBeenCalled();
    expect(reply).not.toHaveBeenCalled();
  });

  it('does not react on deletion', async () => {
    const getMessageContent = vi.spyOn(repo, 'getMessageContent');
    const reply = vi.fn(() => Promise.resolve());
    await responder.on(
      'DELETE',
      createMockMessage(
        {
          args: ['debug', '1423523'],
          senderChannelId: '8623233' as Snowflake
        },
        reply
      )
    );
    expect(getMessageContent).not.toHaveBeenCalled();
    expect(reply).not.toHaveBeenCalled();
  });
});
