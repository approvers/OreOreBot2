import { describe, expect, it, vi } from 'vitest';
import { EmojiSeqReact } from './emoji-seq-react.js';

describe('EmojiSeqReact', () => {
  const responder = new EmojiSeqReact(`
- pattern: 響
  emojisToSend:
    - <:haracho:684424533997912096>
`);

  it('adds the reaction to creation a message that contains Hibiki', async () => {
    const addReaction = vi.fn<[string], Promise<void>>(() => Promise.resolve());
    await responder.on('CREATE', {
      content: '響き',
      addReaction
    });
    expect(addReaction).toBeCalledTimes(1);
    expect(addReaction).toHaveBeenCalledWith('<:haracho:684424533997912096>');
  });

  it('does not anything on deletion', async () => {
    const addReaction = vi.fn<[string], Promise<void>>(() => Promise.resolve());
    await responder.on('DELETE', {
      content: '響',
      addReaction
    });
    expect(addReaction).not.toHaveBeenCalled();
  });
});
