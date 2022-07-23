import type { Reservation, ReservationTime } from '../model/reservation.js';
import type {
  ReservationRepository,
  ReservationResult
} from '../service/command/kaere.js';

export class InMemoryReservationRepository implements ReservationRepository {
  map: Map<string, Reservation> = new Map();

  private mapTimeToKey(time: ReservationTime): string {
    return `${time.hours}:${time.minutes}`;
  }

  all(): Promise<readonly Reservation[]> {
    return Promise.resolve([...this.map.values()]);
  }
  reservationAt(time: ReservationTime): Promise<Reservation | null> {
    return Promise.resolve(this.map.get(this.mapTimeToKey(time)) ?? null);
  }
  reserve(reservation: Reservation): Promise<ReservationResult> {
    const key = this.mapTimeToKey(reservation.time);
    if (this.map.has(key)) {
      return Promise.resolve('Err');
    }
    this.map.set(key, reservation);
    return Promise.resolve('Ok');
  }
  cancel(reservation: Reservation): Promise<ReservationResult> {
    return Promise.resolve(
      this.map.delete(this.mapTimeToKey(reservation.time)) ? 'Ok' : 'Err'
    );
  }
}
