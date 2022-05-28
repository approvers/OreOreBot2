import type { Clock } from '../runner';

export class MockClock implements Clock {
  constructor(public placeholder: Date) {}

  now(): Date {
    return this.placeholder;
  }
}

export class ActualClock implements Clock {
  now(): Date {
    return new Date();
  }
}
