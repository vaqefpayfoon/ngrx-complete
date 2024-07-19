import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

// Date Pipe
import { DatePipe } from '@angular/common';

// Models
import { IReservations } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Angular forms
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { IPromotions } from '@neural/modules/rewards';
import { InProgressFacade } from '../../+state/facade';

@Component({
  selector: 'neural-in-progress-card',
  templateUrl: './in-progress-card.component.html',
  styleUrls: ['./in-progress-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class InProgressCardComponent implements OnChanges {
  @Input() timeZone: string;

  @Input() inProgressJob: IReservations.IInProgressJob;

  @Input() error: IReservations.IError;

  @Input() dailyReportError: any;

  @Input() loading: any;

  @Input() permissions: any;

  @Input() report: IReservations.IAnalytics | null;

  @Input() inProgressJobList: IReservations.IInProgressJobList;

  @Output()
  refreshChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  reportChange: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  referenceNoChange: EventEmitter<{referenceNumber: string, reservationParam: boolean}> = new EventEmitter<{referenceNumber: string, reservationParam: boolean}>();

  form = this.fb.group({
    date: ['', Validators.compose([Validators.required])],
  });

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.loading && changes.loading.currentValue) {
      // this.form.reset();
    }
  }

  get account() {
    return this.inProgressJob?.job?.account;
  }

  get accountVehicle() {
    return this.inProgressJob?.job?.accountVehicle;
  }

  get branch() {
    return this.inProgressJob?.job?.branch;
  }

  get calendar() {
    return this.inProgressJob?.job?.calendar;
  }

  get location() {
    return this.inProgressJob?.job?.location;
  }

  get operation() {
    return this.inProgressJob?.job?.operation;
  }

  get summary() {
    return this.inProgressJob?.job?.summary;
  }

  get payment() {
    return this.inProgressJob?.job?.payment;
  }

  get fleet() {
    return this.inProgressJob?.job?.fleet;
  }

  get services() {
    return this.inProgressJob?.job?.services;
  }

  get products() {
    return this.inProgressJob?.job?.products;
  }
  get corporate() {
    return this.inProgressJob?.job?.corporate;
  }
  refresh() {
    this.refreshChange.emit(true);
  }

  onSubmit(form: FormGroup) {
    const { valid, value } = form;

    if (valid) {
      const date = this.datePipe.transform(value.date, 'yyyy-MM-dd');
      this.reportChange.emit(date);
    }
  }

  get inProgressPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Reservation.GET_INPROGRESS]
    ) {
      return true;
    }
    return false;
  }

  get operationDailyReport() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Analytic.OPERATION_DAILY_REPORT]
    ) {
      return true;
    }
    return false;
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

  getInProgress(referenceNumber, reservationParam) {
    this.referenceNoChange.emit({referenceNumber, reservationParam});
  }
}
