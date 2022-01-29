import {
  composeMessageEventResponders,
  composeMessageUpdateEventResponders
} from '../runner';
import { DeletionRepeater } from './deletion-repeater';
import { DifferenceDetector } from './difference-detector';

export const allMessageEventResponder = () =>
  composeMessageEventResponders(new DeletionRepeater());

export const allMessageUpdateEventResponder = () =>
  composeMessageUpdateEventResponders(new DifferenceDetector());
