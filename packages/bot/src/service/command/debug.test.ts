import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';

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
  const repo: MessageRepository = {
    getMessageContent: () => Promise.resolve(undefined)
  };
  const getMessageContent = spyOn(repo, 'getMessageContent');
  const reg = new DepRegistry();
  reg.add(messageRepositoryKey, repo);
  const responder = new DebugCommand(reg);

  beforeEach(() => {
    getMessageContent.mockClear();
  });

  it('outputs debug format', async () => {
    getMessageContent.mockImplementation(() => Promise.resolve('🅰️ Hoge'));
    const reply = mock();
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
    getMessageContent.mockImplementation(() =>
      Promise.resolve(`\`\`\`js
console.log(\`Hello, \${name}!\`);
\`\`\``)
    );
    const reply = mock();
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
    getMessageContent.mockImplementation(() => Promise.resolve(undefined));
    const reply = mock();
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
