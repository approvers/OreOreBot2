import type { MessageResponseRunner, MessageEventResponder } from '../runner';
import { Mitetazo, Observable } from './mitetazo';

export type AllMessageEventBoundary = Observable;

export function registerResponders<M extends AllMessageEventBoundary>(
  runner: MessageResponseRunner<M>
) {
  const responders: MessageEventResponder<M>[] = [new Mitetazo()];
  for (const responder of responders) {
    runner.addResponder(responder);
  }
}
