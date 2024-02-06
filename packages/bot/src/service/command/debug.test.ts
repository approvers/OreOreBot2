import { afterEach, describe, expect, it, vi } from 'vitest';

import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';
import { DepRegistry } from '../../driver/dep-registry.js';
import type { Snowflake } from '../../model/id.js';
import { createMockMessage } from './command-message.js';
import {
  DebugCommand,
  messageRepositoryKey,
  type MessageRepository
} from './debug.js';

describe('debug', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const repo: MessageRepository = {
    getMessageContent: () => Promise.resolve(undefined)
  };
  const reg = new DepRegistry();
  reg.add(messageRepositoryKey, repo);
  const responder = new DebugCommand(reg);

  it('outputs debug format', async () => {
    const getMessageContent = vi
      .spyOn(repo, 'getMessageContent')
      .mockImplementation(() => Promise.resolve('🅰️ Hoge'));
    const reply = vi.fn();
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['debug', '1423523'], responder.schema),
        reply,
        {
          senderChannelId: '8623233' as Snowflake
        }
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
    const reply = vi.fn();
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['debug', '1423523'], responder.schema),
        reply,
        {
          senderChannelId: '8623233' as Snowflake
        }
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

  it('errors on message not found', async () => {
    const getMessageContent = vi.spyOn(repo, 'getMessageContent');
    const reply = vi.fn();
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['debug', '1423523'], responder.schema),
        reply,
        {
          senderChannelId: '8623233' as Snowflake
        }
      )
    );
    expect(getMessageContent).toHaveBeenCalledWith('8623233', '1423523');
    expect(reply).toHaveBeenCalledWith({
      title: '指定のメッセージが見つからなかったよ',
      description: 'そのメッセージがこのチャンネルにあるかどうか確認してね。'
    });
  });
});
