import { DeletionRepeater } from './deletion-repeater';
import { composeMessageEventResponders } from '../runner';

export const allMessageEventResponder = () =>
  composeMessageEventResponders(new DeletionRepeater());
