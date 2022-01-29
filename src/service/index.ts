import { DeletionObservable, DeletionRepeater } from './deletion-repeater';
import { composeMessageEventResponders } from '../runner';
import { EditingObservable, EditingObserver } from './editing-observer';

type AllMessage = DeletionObservable & EditingObservable;

export const allMessageEventResponder = () =>
  composeMessageEventResponders<AllMessage>(
    new DeletionRepeater(),
    new EditingObserver()
  );
