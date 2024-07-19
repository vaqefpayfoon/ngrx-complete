import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Input
} from '@angular/core';

// Auth
import { Auth } from '@neural/auth';

// Models
import { IReservations } from '../../models';
import { IPromotions } from '@neural/modules/rewards';
@Component({
  selector: 'neural-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationFormComponent implements OnChanges {
  @Input() timeZone: string;

  @Input() reservation: IReservations.IDocument;

  @Input() error: any;

  @Input() loading: boolean;

  @Input() selectedBranch: Auth.IBranch;

  @Output() loaded = new EventEmitter<IReservations.IDocument>();

  @Output() branchChange = new EventEmitter();

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedBranch && !changes.selectedBranch.firstChange) {
      this.branchChange.emit(true);
    }

    if (changes.reservation && changes.reservation.currentValue) {
      this.loaded.emit(this.reservation);
    }
  }

  get account() {
    return this.reservation.account;
  }

  get accountVehicle() {
    return this.reservation.accountVehicle;
  }

  get branch() {
    return this.reservation.branch;
  }

  get calendar() {
    return this.reservation.calendar;
  }

  get location() {
    return this.reservation.location;
  }

  get operation() {
    return this.reservation.operation;
  }

  get summary() {
    return this.reservation.summary;
  }

  get payment() {
    return this.reservation.payment;
  }

  get fleet() {
    return this.reservation.fleet;
  }

  get services() {
    return this.reservation.services;
  }

  get products() {
    return this.reservation.products;
  }
  get corporate() {
    return this.reservation.corporate;
  }

  get promoTypes() {
    return IPromotions.Types;
  }

  get promoDiscountTypes() {
    return IPromotions.DiscountTypes;
  }

  get upcomingTypes() {
    return IReservations.UpcomingTypes
  }
}
