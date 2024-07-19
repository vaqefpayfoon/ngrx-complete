import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

// Models
import { IReservations } from '../../models';

@Component({
  selector: 'neural-reservation-statistics',
  templateUrl: './reservation-statistics.component.html',
  styleUrls: ['./reservation-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationStatisticsComponent {
  @Input() statuses: string[];

  @Input() reservations: IReservations.IDocument[];

  @Input() totalBooking: number;

  @Input() totalSlot: number;

  @Output() statusChanges: EventEmitter<string[]> = new EventEmitter<
    string[]
  >();

  constructor() {}

  statusName(status: string) {
    switch (status) {
      case IReservations.Status.JOB_CANCELED:
        return 'CANCELLED';
    }
  }

  private _removeOccurrences(data: string, event: string) {
    return data.split(event).join(' ');
  }

  statusCount(status: string) {
    return this.reservations.filter((x) => x.status === status).length;
  }

  removeStatus(status: string) {
    if (this.reservations.length !== 0) {
      this.statusChanges.emit(
        this.statuses.filter((value) => {
          return value !== status;
        })
      );
    }
  }

  get reservationStatus() {
    return IReservations.Status;
  }
}
