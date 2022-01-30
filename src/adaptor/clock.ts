import type { Clock } from '../runner';

export class MockClock implements Clock {
  constructor(private readonly placeholder: Date) {}

  now(): Date {
    return this.placeholder;
  }
}

export class ActualClock implements Clock {
  now(): Date {
    return new Date();
  }
}
