import { InMemoryTypoRepository, MockClock } from '../adaptor';
import { TypoRecorder, TypoReporter, type TypoRepository } from './typo-record';
import { addDays, setHours, setMinutes } from 'date-fns';
import EventEmitter from 'events';
import { ScheduleRunner } from '../runner';
import type { Snowflake } from '../model/id';
import { createMockMessage } from './command-message';

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

test('react to だカス', async () => {
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

test('must not react', async () => {
  const fn = jest.fn();
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

test('show all typos', async () => {
  const clock = new MockClock(new Date(0));
  const db = new InMemoryTypoRepository();
  await db.addTypo('279614913129742338' as Snowflake, 'foo');
  await db.addTypo('279614913129742338' as Snowflake, 'hoge');
  await db.addTypo('279614913129742338' as Snowflake, 'fuga');
  await db.addTypo('000000000000000001' as Snowflake, 'null');

  const runner = new ScheduleRunner(clock);

  const responder = new TypoReporter(db, clock, runner);
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['typo']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: `† 今日のMikuroさいなのtypo †`,
          description: '- foo\n- hoge\n- fuga'
        });
        return Promise.resolve();
      }
    )
  );

  runner.killAll();
});

test('must not reply', async () => {
  const clock = new MockClock(new Date(0));
  const db = new InMemoryTypoRepository();
  const runner = new ScheduleRunner(clock);
  const responder = new TypoReporter(db, clock, runner);

  const fn = jest.fn();
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

  runner.killAll();
});

test('clear typos on next day', async () => {
  const clock = new MockClock(new Date(0));
  const db = new InMemoryTypoRepository();
  await db.addTypo('279614913129742338' as Snowflake, 'foo');
  await db.addTypo('279614913129742338' as Snowflake, 'hoge');

  const runner = new ScheduleRunner(clock);

  const responder = new TypoReporter(db, clock, runner);
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['typo']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: `† 今日のMikuroさいなのtypo †`,
          description: '- foo\n- hoge'
        });
        return Promise.resolve();
      }
    )
  );

  const now = clock.now();
  const nextDay = addDays(now, 1);
  const nextDay6 = setHours(nextDay, 6);
  clock.placeholder = setMinutes(nextDay6, 1);

  await new Promise((resolve) => setTimeout(resolve, 100));

  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['typo']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: `† 今日のMikuroさいなのtypo †`,
          description: ''
        });
        return Promise.resolve();
      }
    )
  );

  runner.killAll();
});
