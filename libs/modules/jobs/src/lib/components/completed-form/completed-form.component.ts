import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';

// Models
import { IReservations } from '../../models';
import { IPromotions } from '@neural/modules/rewards';

// Auth
import { Auth } from '@neural/auth';

@Component({
  selector: 'neural-completed-form',
  templateUrl: './completed-form.component.html',
  styleUrls: ['./completed-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompletedFormComponent implements OnChanges {
  @Input() timeZone: string;

  @Input() reservation: IReservations.IDocument;

  @Input() selectedBranch: Auth.IBranch;

  @Input() error: any;

  @Input() loading: boolean;

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

  checkTimeStamp(value:number) {
    if (new Date(value * 1000).getTime() > 0) {
      return true;
    }
    return false;
  }

  get account() {
    return this.reservation.account;
  }

  get accountVehicle() {
    return this.reservation.accountVehicle;
  }

  get vehicleReference() {
    return this.accountVehicle.vehicleReference;
  }

  get unit() {
    return this.vehicleReference.unit;
  }

  get unitName() {
    return `${this.unit.brand} ${this.unit.model.display} ${this.unit.variant.display}`;
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
    return this.reservation?.products;
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
    return IReservations.UpcomingTypes;
  }
}
