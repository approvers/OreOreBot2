import { DebugCommand, MessageRepository } from './debug.js';
import { describe, expect, it, vi } from 'vitest';
import { Snowflake } from '../model/id.js';
import { createMockMessage } from './command-message.js';

describe('debug', () => {
  const repo: MessageRepository = {
    getMessageContent: () => Promise.resolve(undefined)
  };
  const responder = new DebugCommand(repo);

  it('outputs debug format', async () => {
    const getMessageContent = vi
      .spyOn(repo, 'getMessageContent')
      .mockImplementation(() => Promise.resolve('🅰️ Hoge'));
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
      title: 'デバッグ出力',
      description: '```\n🅰️ Hoge\n```'
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
      title: 'デバッグ出力',
      description: `\`\`\`
'''js
console.log(\`Hello, \${name}!\`);
'''
\`\`\``,
      footer:
        "三連続の ` (バッククォート) は ' (シングルクォート) に置換してあるよ。"
    });
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
