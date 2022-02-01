import type { Lifter, RawMessage } from '.';

export const execOnlyUserMessage: Lifter<RawMessage, RawMessage> =
  (func: (message: RawMessage) => Promise<void>) =>
  async (message: RawMessage) => {
    if (!message.author?.bot) {
      await func(message);
    }
  };
