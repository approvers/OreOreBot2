import { InMemoryTypoRepository, MockClock } from '../adaptor/index.js';
import { SentMessage, createMockMessage } from './command-message.js';
import {
  TypoRecorder,
  TypoReporter,
  type TypoRepository
} from './typo-record.js';
import { addDays, setHours, setMinutes } from 'date-fns';
import { afterAll, describe, expect, it, vi } from 'vitest';
import type { EmbedMessage } from '../model/embed-message.js';
import EventEmitter from 'events';
import { ScheduleRunner } from '../runner/index.js';
import type { Snowflake } from '../model/id.js';

class MockRepository extends EventEmitter implements TypoRepository {
  private db = new InMemoryTypoRepository();

  addTypo(id: Snowflake, newTypo: string): Promise<void> {
    this.emit('ADD_TYPO', id, newTypo);
    return this.db.addTypo(id, newTypo);
  }
  allTyposByDate(id: Snowflake): Promise<readonly string[]> {
    this.emit('ALL_TYPOS', id);
    return this.db.allTyposByDate(id);
  }
  clear(): Promise<void> {
    this.emit('CLEAR');
    return this.db.clear();
  }
}

it('react to だカス', async () => {
  const mock = new MockRepository();
  mock.on('ADD_TYPO', (id, newTypo) => {
    expect(id).toEqual('279614913129742338');
    expect(newTypo).toEqual('京都帝国大学じゃなくて今日とて');
  });
  const responder = new TypoRecorder(mock);
  await responder.on('CREATE', {
    content: `京都帝国大学じゃなくて今日とてだカス`,
    authorId: '279614913129742338' as Snowflake
  });
});

it('must not react', async () => {
  const fn = vi.fn();
  const mock = new MockRepository();
  mock.on('ADD_TYPO', fn);
  mock.on('ALL_TYPOS', fn);
  mock.on('CLEAR', fn);
  const responder = new TypoRecorder(mock);
  await responder.on('CREATE', {
    content: `だカス`,
    authorId: '279614913129742338' as Snowflake
  });
  await responder.on('CREATE', {
    content: `だカスカだ`,
    authorId: '279614913129742338' as Snowflake
  });
  await responder.on('CREATE', {
    content: `なにだカス
ではない`,
    authorId: '279614913129742338' as Snowflake
  });
  await responder.on('DELETE', {
    content: `京都帝国大学じゃなくて今日とてだカス`,
    authorId: '279614913129742338' as Snowflake
  });
  expect(fn).not.toHaveBeenCalled();
});

describe('typo record command', () => {
  const clock = new MockClock(new Date(0));
  const db = new InMemoryTypoRepository();
  const runner = new ScheduleRunner(clock);
  const responder = new TypoReporter(db, clock, runner);

  afterAll(() => runner.killAll());

  it('show all typos', async () => {
    const db = new InMemoryTypoRepository();
    await db.addTypo('279614913129742338' as Snowflake, 'foo');
    await db.addTypo('279614913129742338' as Snowflake, 'hoge');
    await db.addTypo('279614913129742338' as Snowflake, 'fuga');
    await db.addTypo('000000000000000001' as Snowflake, 'null');

    const responder = new TypoReporter(db, clock, runner);
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['typo']
        },
        (message) => {
          expect(message).toStrictEqual({
            description:
              '***† 今日のMikuroさいなのtypo †***\n- foo\n- hoge\n- fuga'
          });
          return Promise.resolve();
        }
      )
    );
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['typo', 'by', '279614913129742338']
        },
        (message) => {
          expect(message).toStrictEqual({
            description:
              '***† 今日の<@279614913129742338>のtypo †***\n- foo\n- hoge\n- fuga'
          });
          return Promise.resolve();
        }
      )
    );
  });

  it('invalid user id', async () => {
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['typo', 'by', 'hoge']
        },
        (message) => {
          expect(message).toStrictEqual({
            title: '入力形式エラー',
            description: 'ユーザ ID は整数を入力してね'
          });
          return Promise.resolve();
        }
      )
    );
  });

  it('must not reply', async () => {
    const fn = vi.fn();
    await responder.on(
      'DELETE',
      createMockMessage({
        senderId: '279614913129742338' as Snowflake,
        senderGuildId: '683939861539192860' as Snowflake,
        senderName: 'Mikuroさいな',
        args: ['typo'],
        reply: fn
      })
    );
    expect(fn).not.toHaveBeenCalled();
  });

  it('help', async () => {
    const fn = vi.fn<[EmbedMessage]>(() => Promise.resolve({} as SentMessage));
    await responder.on(
      'CREATE',
      createMockMessage({
        senderId: '279614913129742338' as Snowflake,
        senderGuildId: '683939861539192860' as Snowflake,
        senderName: 'Mikuroさいな',
        args: ['typo', 'hoge'],
        reply: fn
      })
    );
    expect(fn).toHaveBeenCalledWith({
      title: 'Typoヘルプ',
      description: `
- 引数なし: あなたの今日のTypoを表示するよ
- \`by <ユーザID>\`: そのIDの人の今日のTypoを表示するよ
`
    });
  });

  it('clear typos on next day', async () => {
    const db = new InMemoryTypoRepository();
    await db.addTypo('279614913129742338' as Snowflake, 'foo');
    await db.addTypo('279614913129742338' as Snowflake, 'hoge');
    const responder = new TypoReporter(db, clock, runner);
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['typo']
        },
        (message) => {
          expect(message).toStrictEqual({
            description: '***† 今日のMikuroさいなのtypo †***\n- foo\n- hoge'
          });
          return Promise.resolve();
        }
      )
    );

    const now = clock.now();
    const nextDay = addDays(now, 1);
    const nextDay6 = setHours(nextDay, 6);
    clock.placeholder = setMinutes(nextDay6, 1);
    runner.consume();

    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['typo']
        },
        (message) => {
          expect(message).toStrictEqual({
            description: '***† 今日のMikuroさいなのtypo †***\n'
          });
          return Promise.resolve();
        }
      )
    );
  });
});
