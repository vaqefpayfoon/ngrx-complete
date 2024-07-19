import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';

// Model
import { IManualReservations, IReservations } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-manual-reservation-card',
  templateUrl: './manual-reservation-card.component.html',
  styleUrls: ['./manual-reservation-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualReservationCardComponent implements OnChanges {
  @Input() timeZone: string;

  @Input() disabled: boolean;

  @Input() permissions: any;

  @Input() reservation: IManualReservations.IDocument;

  @Output() completeChange = new EventEmitter<IManualReservations.IDocument>();

  @Output() resetChange = new EventEmitter<IManualReservations.IDocument>();

  @Output() cancelChange = new EventEmitter<IManualReservations.IDocument>();

  @Input() openPanelState: Boolean;

  constructor() {}

  ngOnChanges(): void {}

  compeleteReservation() {
    this.completeChange.emit(this.reservation);
  }

  resetReservation() {
    this.resetChange.emit(this.reservation);
  }

  cancelReservation() {
    this.cancelChange.emit(this.reservation);
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
      case IReservations.Status.NOT_OPERATIONAL:
        return 'SERVICE CENTER';
      case IReservations.Status.NO_SHOW:
        return 'NO SHOW';
    }
  }

  handleDropWait(value: string) {
    switch (value) {
      case IManualReservations.Logistic.DROP_IN:
        return 'Drop';

      case IManualReservations.Logistic.WAIT:
        return 'Wait';
    }
  }

  get rawStatus() {
    return this.reservation ? this.reservation?.status : null;
  }

  get cancel() {
    if (
      this.rawStatus === IReservations.Status.JOB_PENDING ||
      this.rawStatus === IReservations.Status.FLEET_EN_ROUTE
    ) {
      return true;
    }
    return false;
  }

  get complete() {
    if (
      this.rawStatus === IReservations.Status.FLEET_EN_ROUTE ||
      this.rawStatus === IReservations.Status.JOB_IN_PROGRESS
    ) {
      return true;
    }
    return false;
  }

  get reset() {
    if (
      this.rawStatus === IReservations.Status.FLEET_EN_ROUTE ||
      this.rawStatus === IReservations.Status.JOB_IN_PROGRESS
    ) {
      return true;
    }
    return false;
  }

  get reschedule() {
    if (this.rawStatus === IReservations.Status.JOB_PENDING) {
      return true;
    }
    return false;
  }

  get previewPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.ManualReservation.GET_MANUAL_RESERVATION]
    ) {
      return true;
    }
    return false;
  }

  get compeletePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Reservation.COMPLETE_RESERVATION]
    ) {
      return true;
    }
    return false;
  }

  get resetPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Reservation.RESET_RESERVATION]
    ) {
      return true;
    }
    return false;
  }

  get cancelPermission() {
    if (this.reservation.mobileService) {
      if (
        this.permissions &&
        this.permissions[permissionTags.Reservation.CANCEL_MOBILE_RESERVATION]
      ) {
        return true;
      }
      return false;
    } else {
      if (
        this.permissions &&
        this.permissions[
          permissionTags.Reservation.CANCEL_SERVICE_CENTER_RESERVATION
        ]
      ) {
        return true;
      }
      return false;
    }
  }

  get deletePermission() {
    if (
      this.permissions &&
      this.permissions[
        permissionTags.ManualReservation.DELETE_MANUAL_RESERVATION
      ]
    ) {
      return true;
    }
    return false;
  }

  get appointmentStatus(): boolean {
    return this.reservation?.appointment?.id ? true : false;
  }
}
