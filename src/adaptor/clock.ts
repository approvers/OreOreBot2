import type { Clock } from '../runner/index.js';

export class MockClock implements Clock {
  constructor(public placeholder: Date) {}

  now(): Date {
    return new Date(this.placeholder.getUTCMilliseconds());
  }
}

export class ActualClock implements Clock {
  now(): Date {
    return new Date(new Date().getUTCMilliseconds());
  }
}
