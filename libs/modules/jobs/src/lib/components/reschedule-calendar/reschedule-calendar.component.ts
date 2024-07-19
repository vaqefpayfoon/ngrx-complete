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
import { ICalendar, IReservations } from '../../models';
import { Auth } from '@neural/auth';

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

// Angular forms
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';

// Material calendar
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Location
import { Location } from '@angular/common';

// Format date picker
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'neural-reschedule-calendar',
  templateUrl: './reschedule-calendar.component.html',
  styleUrls: ['./reschedule-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class RescheduleCalendarComponent implements OnChanges {
  @Input() router: any;

  @Input() timezone: string;

  @Input() reservation: IReservations.IDocument;

  @Input() branch: Auth.IBranch;

  @Input()
  error: any;

  exists: boolean;

   minDate=new Date()

  @Input() permissions: any;

  @Output()
  create: EventEmitter<ICalendar.IGetCalendar> = new EventEmitter<
    ICalendar.IGetCalendar
  >();

  @Output() branchChange = new EventEmitter();

  @Output() loaded = new EventEmitter<IReservations.IDocument>();

  form = this.fb.group({
    branchUuid: ['', Validators.compose([Validators.required])],
    date: [moment(), Validators.compose([Validators.required])],
    year: ['', Validators.compose([Validators.required])],
    month: ['', Validators.compose([Validators.required])],
    accountVehicleUuid: ['', Validators.compose([Validators.required])],
    selectedTypes: [
      '',
      Validators.compose([Validators.required, Validators.minLength[1]]),
    ],
    csaId: [''],
  });

  constructor(private fb: FormBuilder, private location: Location) {
    const ctrlValue = this.date.value;
    this.year.setValue(ctrlValue.year());
    this.month.setValue(ctrlValue.month() + 1);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.branch && !changes.branch.firstChange) {
      this.branchChange.emit(true);
    }

    if (changes.branch && changes.branch.currentValue) {
      this.branchUuid.setValue(this.branch.uuid);
    }

    if (changes.reservation && changes.reservation.currentValue) {
      this.loaded.emit(this.reservation);
      this.accountVehicleUuid.setValue(this.reservation.accountVehicle.uuid);
    }

    if (changes.router && changes.router.currentValue) {
      const { types } = this.router.state.data;

      this.selectedTypes.patchValue([
        this.reservation?.calendar?.selectedTypes,
      ]);
    }
  }

  cancel() {
    if (this.exists) {
      this.exists = true;
      this.form.disable();
    }
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.year.patchValue(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    this.month.patchValue(normalizedMonth.month() + 1);
    datepicker.close();
  }

  get formDisabled() {
    return this.form.disabled;
  }

  get branchUuid() {
    return this.form.get('branchUuid') as FormControl;
  }

  get accountVehicleUuid() {
    return this.form.get('accountVehicleUuid') as FormControl;
  }

  get selectedTypes() {
    return this.form.get('selectedTypes') as FormControl;
  }

  get date() {
    return this.form.get('date') as FormControl;
  }

  get year() {
    return this.form.get('year') as FormControl;
  }

  get month() {
    return this.form.get('month') as FormControl;
  }

  createCalendar(form: FormGroup) {
    const { value, valid } = form;
    // if (valid) {
    delete value.date;
    this.create.emit(value);
    // }
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Reservation.RESCHEDULE_MOBILE_RESERVATION]
    ) {
      return true;
    }
    return false;
  }
}
