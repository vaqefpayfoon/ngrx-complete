import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

// Model
import { IReservations } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrls: ['./reservation-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationCardComponent {
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

  reservationStatus = IReservations.Status;

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
    return this.reservation ? this.statusName(this.reservation.status) : null;
  }

  statusName(status: string) {
    switch (status) {
      case IReservations.Status.BOOKING_ON_HOLD:
        return 'ON HOLD';
      case IReservations.Status.JOB_CANCELED:
        return 'CANCELLED';
      case IReservations.Status.NOT_OPERATIONAL:
        return 'SERVICE CENTER';
    }
  }

  get referenceNumber() {
    return this.reservation ? this.reservation.referenceNumber : null;
  }

  get address() {
    return this.reservation && this.reservation.location
      ? this.reservation.location.address
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

  get previewPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Reservation.GET_RESERVATION]
    ) {
      return true;
    }
    return false;
  }
  get appointmentStatus(): boolean {
    return this.reservation?.appointment?.id ? true : false;
  }
}
