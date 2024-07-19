import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

// Models
import { IReservations } from '../../models';

@Component({
  selector: 'neural-completed-statistics',
  templateUrl: './completed-statistics.component.html',
  styleUrls: ['./completed-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompletedStatisticsComponent {
  @Input() statuses: string[];

  @Input() reservations: IReservations.IDocument[];

  @Input() total: number;

  @Input() totalSlot: number;

  @Input() manualReservations: IReservations.IDocument[];

  @Input() reports: {
    services: IReservations.IJob;
    jobs: IReservations.IJob;
    amendedInvoices: IReservations.IJob;
  } | null;

  @Output() statusChanges: EventEmitter<string[]> = new EventEmitter<
    string[]
  >();

  @Output() serviceChange = new EventEmitter();
  @Output() jobsChange = new EventEmitter();
  @Output() amendedInvoicesChange = new EventEmitter();

  constructor() {}

  statusName2(status: string) {
    return this._removeOccurrences(status, '_');
  }

  statusName(status: string) {
    switch (status) {
      case IReservations.Status.JOB_PENDING:
        return 'PENDING';
      case IReservations.Status.FLEET_EN_ROUTE:
        return 'FLEET EN ROUTE';
      case IReservations.Status.JOB_IN_PROGRESS:
        return 'IN PROGRESS';
      case IReservations.Status.JOB_COMPLETED:
        return 'COMPLETED';
      case IReservations.Status.BOOKING_ON_HOLD:
        return 'ON HOLD';
      case IReservations.Status.JOB_CANCELED:
        return 'CANCELLED';
      case IReservations.Status.NOT_OPERATIONAL:
        return 'SERVICE CENTER';
      case IReservations.Status.NO_SHOW:
         return 'NO SHOW';
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

  getServiceReport() {
    this.serviceChange.emit();
  }

  getJobsReport() {
    this.jobsChange.emit();
  }

  getAmendedInvoicesReport() {
    this.amendedInvoicesChange.emit();
  }

  get rosterType() {
    return IReservations.RosterType;
  }
}
