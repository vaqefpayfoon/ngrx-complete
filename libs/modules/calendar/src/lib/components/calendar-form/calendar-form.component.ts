import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

// Models
import { ICalendars } from '../../models';

// Auth
import { Auth } from '@neural/auth';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';

// Location
import { Location } from '@angular/common';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Calendar API
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';

// Moment
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

const moment = _rollupMoment || _moment;

// Format date picker
const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'neural-calendar-form',
  templateUrl: './calendar-form.component.html',
  styleUrls: ['./calendar-form.component.scss'],
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
export class CalendarFormComponent implements OnChanges, OnInit {
  @Input() selectedBranch: Auth.IBranch;

  @Input() permissions: any;

  @Output() branchChange = new EventEmitter();

  @Output() create = new EventEmitter<ICalendars.IGenerateInternalCalendars>();

  form = this.fb.group({
    type: ['', Validators.required],
    branchUuid: ['', Validators.required],
    days: ['', Validators.required],
    start: ['', Validators.required],
    end: ['', Validators.required],
  });

  dateTypeModel = ICalendars.DateType.RANGE;

  constructor(private fb: FormBuilder, private location: Location) {
    this.days.disable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedBranch && !changes.selectedBranch.firstChange) {
      this.branchChange.emit(true);
    }

    if (changes.selectedBranch && changes.selectedBranch.currentValue) {
      this.branchUuid.setValue(this.selectedBranch.uuid);
    }
  }

  ngOnInit() {
    this.changeType(ICalendars.DateType.RANGE);
  }

  onChange(event: MatRadioChange) {
    const { value } = event;
    this.changeType(value);
  }

  private changeType(value: ICalendars.DateType) {
    switch (value) {
      case ICalendars.DateType.DAYS:
        this.start.disable();
        this.end.disable();
        this.days.enable();

        break;

      case ICalendars.DateType.RANGE:
        this.days.disable();

        this.start.enable();
        this.end.enable();

        break;
    }
  }

  cancel() {
    this.location.back();
  }

  changeStartDate(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      const date = moment(event?.value).toISOString().toString();

      this.form.get('start').setValue(date, {
        onlySelf: true,
      });
    }
  }

  changeEndDate(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      const date = moment(event?.value).toISOString().toString();

      this.form.get('end').setValue(date, {
        onlySelf: true,
      });
    }
  }

  onCreate(form: FormGroup) {
    const { valid, value } = form;

    if (valid) {
      this.create.emit(value);
      this.form.disable();
    }
  }

  onEdit(form: FormGroup): void {
    const { value } = form;
    this.form.enable();

    this.changeType(
      !!value?.days ? ICalendars.DateType.DAYS : ICalendars.DateType.RANGE
    );
  }

  get dateType() {
    return ICalendars.DateType;
  }

  get CalendarType() {
    return ICalendars.CalendarType;
  }

  get type(): FormControl {
    return <FormControl>this.form.get('type');
  }

  get branchUuid(): FormControl {
    return <FormControl>this.form.get('branchUuid');
  }

  get start(): FormControl {
    return <FormControl>this.form.get('start');
  }

  get end(): FormControl {
    return <FormControl>this.form.get('end');
  }

  get days(): FormControl {
    return <FormControl>this.form.get('days');
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Calendar.GENERATE_CALENDARS]
    ) {
      return true;
    }
    return false;
  }
}
