import EventEmitter from 'events';
import { InMemoryTypoRepository } from '../adaptor';
import { Snowflake } from '../model/id';
import { TypoRecorder, TypoRepository } from './typo-record';

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
