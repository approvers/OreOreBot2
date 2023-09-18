import type { Middleware, RawMessage } from '../middleware.js';

export const botFilter: Middleware<RawMessage, RawMessage> = (
  message: RawMessage
) => {
  if (!message.author?.bot && !message.system) {
    return Promise.resolve(message);
  }
  return Promise.reject(new Error('the message is not from user'));
};
