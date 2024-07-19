import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';

// Model
import { IReservations } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-completed-card',
  templateUrl: './completed-card.component.html',
  styleUrls: ['./completed-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompletedCardComponent {
  @Input() timeZone: string;
  
  @Input() disabled: boolean;

  @Input() permissions: any;

  @Input() reservation: IReservations.IDocument;

  @Output()
  cancelChange: EventEmitter<IReservations.IDocument> = new EventEmitter<
    IReservations.IDocument
  >();

  @Output()
  completeChange: EventEmitter<IReservations.IDocument> = new EventEmitter<
    IReservations.IDocument
  >();

  @Output()
  resetChange: EventEmitter<IReservations.IDocument> = new EventEmitter<
    IReservations.IDocument
  >();

  @Output()
  rescheduleChange: EventEmitter<IReservations.IDocument> = new EventEmitter<
    IReservations.IDocument
  >();

  reservationStatus = IReservations.Status;

  @Input()openPanelState:Boolean;

  constructor() {}

  get account() {
    return this.reservation ? this.reservation.account : null;
  }

  get name() {
    return this.account ? this.account.identity : null;
  }

  get phone() {
    return this.account ? this.account.phone : null;
  }

  get accountVehicle() {
    return this.reservation ? this.reservation.accountVehicle : null;
  }

  get vehicleReference() {
    return this.accountVehicle ? this.accountVehicle.vehicleReference : null;
  }

  get unit() {
    return this.vehicleReference ? this.vehicleReference.unit : null;
  }

  get numberPlate() {
    return this.accountVehicle ? this.accountVehicle.numberPlate : null;
  }

  get uuid() {
    return this.reservation ? this.reservation.uuid : null;
  }

  get rawStatus() {
    return this.reservation ? this.reservation.status : null;
  }

  get status() {
    return this.reservation
      ? this._removeOccurrences(this.reservation.status, '_')
      : null;
  }

  get referenceNumber() {
    return this.reservation ? this.reservation.referenceNumber : null;
  }

  get address() {
    return this.reservation && this.reservation.location
      ? this.reservation.location.address
      : null;
  }

  get branch() {
    return this.reservation && this.reservation.branch
      ? this.reservation.branch.location.address
      : null;
  }

  get time() {
    return this.reservation.calendar.slot;
  }

  get fleet() {
    return this.reservation.fleet;
  }

  get operation() {
    return this.reservation.operation;
  }

  private _removeOccurrences(data: string, event: string) {
    return data.split(event).join(' ');
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

  get cancel() {
    if (
      this.rawStatus === IReservations.Status.JOB_PENDING ||
      this.rawStatus === IReservations.Status.FLEET_EN_ROUTE ||
      this.rawStatus === IReservations.Status.JOB_IN_PROGRESS
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

  get rescheduleService() {
    if (this.rawStatus === IReservations.Status.NOT_OPERATIONAL) {
      return true;
    }
    return false;
  }

  get assing() {
    if (this.rawStatus === IReservations.Status.JOB_PENDING) {
      return true;
    }
    return false;
  }

  cancelReservation(reservation: IReservations.IDocument) {
    this.cancelChange.emit(reservation);
  }

  compeleteReservation(reservation: IReservations.IDocument) {
    this.completeChange.emit(reservation);
  }

  resetReservation(reservation: IReservations.IDocument) {
    this.resetChange.emit(reservation);
  }

  rescheduleMobileReservation(reservation: IReservations.IDocument) {
    this.rescheduleChange.emit(reservation);
  }

  rescheduleServiceCenterReservation(reservation: IReservations.IDocument) {
    this.rescheduleChange.emit(reservation);
  }

  get assignPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Reservation.ASSIGN_OPERATION_TEAM]
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

  get rescheduleMobileReservationPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Reservation.RESCHEDULE_MOBILE_RESERVATION]
    ) {
      return true;
    }
    return false;
  }

  get rescheduleServiceCenterReservationPermission() {
    if (
      this.permissions &&
      this.permissions[
        permissionTags.Reservation.RESCHEDULE_SERVICE_CENTER_RESERVATION
      ]
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

  get previewPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Reservation.GET_RESERVATION]
    ) {
      return true;
    }
    return false;
  }
}
