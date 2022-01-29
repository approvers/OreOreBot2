import {
  composeMessageEventResponders,
  composeMessageUpdateEventResponders
} from '../runner';
import { DeletionRepeater } from './deletion-repeater';
import { EditingObserver } from './editing-observer';

export const allMessageEventResponder = () =>
  composeMessageEventResponders(new DeletionRepeater());

export const allMessageUpdateEventResponder = () =>
  composeMessageUpdateEventResponders(new EditingObserver());
