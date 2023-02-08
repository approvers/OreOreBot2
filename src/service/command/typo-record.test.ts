import EventEmitter from 'node:events';

import { addDays, setHours, setMinutes } from 'date-fns';
import { afterAll, describe, expect, it, vi } from 'vitest';

import { InMemoryTypoRepository, MockClock } from '../../adaptor/index.js';
import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';
import type { Snowflake } from '../../model/id.js';
import { ScheduleRunner } from '../../runner/index.js';
import { createMockMessage } from './command-message.js';
import {
  TypoRecorder,
  TypoReporter,
  type TypoRepository} from './typo-record.js';

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
  const runner = new ScheduleRunner(clock);

  afterAll(() => runner.killAll());

  it('show all typos', async () => {
    const db = new InMemoryTypoRepository();
    await db.addTypo('279614913129742338' as Snowflake, 'foo');
    await db.addTypo('279614913129742338' as Snowflake, 'hoge');
    await db.addTypo('279614913129742338' as Snowflake, 'fuga');
    await db.addTypo('000000000000000001' as Snowflake, 'null');

    const responder = new TypoReporter(db, clock, runner);
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['typo'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description:
              '***† 今日のMikuroさいなのtypo †***\n- foo\n- hoge\n- fuga'
          });
        }
      )
    );
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          ['typo', 'by', '279614913129742338'],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description:
              '***† 今日の<@279614913129742338>のtypo †***\n- foo\n- hoge\n- fuga'
          });
        }
      )
    );
  });

  it('clear typos on next day', async () => {
    const db = new InMemoryTypoRepository();
    await db.addTypo('279614913129742338' as Snowflake, 'foo');
    await db.addTypo('279614913129742338' as Snowflake, 'hoge');
    const responder = new TypoReporter(db, clock, runner);
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['typo'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: '***† 今日のMikuroさいなのtypo †***\n- foo\n- hoge'
          });
        }
      )
    );

    const now = clock.now();
    const nextDay = addDays(now, 1);
    const nextDay6 = setHours(nextDay, 6);
    clock.placeholder = setMinutes(nextDay6, 1);
    runner.consume();

    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['typo'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: '***† 今日のMikuroさいなのtypo †***\n'
          });
        }
      )
    );
  });
});
