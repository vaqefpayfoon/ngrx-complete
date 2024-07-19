import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';

// Model
import { ITestDrives } from '../../models';

// Account tags
import { permissionTags, traverseAndRemove } from '@neural/shared/data';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Auth } from '@neural/auth';

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { IBranches } from '@neural/modules/customer/corporate';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
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
  selector: 'neural-test-drive-form',
  templateUrl: './test-drive-form.component.html',
  styleUrls: ['./test-drive-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TestDriveFormComponent implements OnChanges, OnInit {
  @Input() timeZone: string;

  @Input() disabled: boolean;

  @Input() testDrive: ITestDrives.IDocument;

  @Input() salesAdvisors: Auth.IAccount[];

  @Input() calendars: ITestDrives.ITestDriveCalendar[];

  @Input() permissions: any;

  @Input() selectedBranch: Auth.IBranch;

  @Output() loaded: EventEmitter<ITestDrives.IDocument> = new EventEmitter<
    ITestDrives.IDocument
  >();

  @Output() update: EventEmitter<ITestDrives.IDocument> = new EventEmitter<
    ITestDrives.IDocument
  >();

  @Output() calendarChange = new EventEmitter<{
    filter: ITestDrives.IFilter;
    adtorque: boolean;
  }>();

  @Output() branchChange = new EventEmitter();
  @Input() branch: IBranches.IDocument;

  form = this.fb.group({
    payload: this.payloadGroup(),
  });

  filter: ITestDrives.IFilter;

  today = new Date();

  date = new FormControl({
    value: moment(),
    disabled: true,
  });

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.testDrive && changes.testDrive.currentValue) {
      this.loaded.emit(this.testDrive);

      this.saleAdvisorUuid.patchValue(this.testDrive?.salesAdvisor?.uuid ?? '');
      this.actualDateAndTimeGroup.patchValue(
        this.testDrive?.payload?.actualDateAndTime ?? {}
      );

      this.form.disable();

      this.filter = {
        type: this.testDrive.type,
        modelUuid: this.testDrive?.unit?.modelUuid,
        branchUuid: this.testDrive?.branch?.uuid,
        year: this.today.getFullYear(),
        month: this.today.getMonth() + 1,
      };
      this.calendarChange.emit({
        filter: this.filter,
        adtorque: (this.branch?.configuration?.subscriptions?.adtorque && (this.testDrive.source === 'PRE_OWNED' || this.testDrive.source === 'PRE_OWNED_STREAM'))
          ? true
          : false,
      });
    }

    if (changes.selectedBranch && !changes.selectedBranch.firstChange) {
      this.branchChange.emit(true);
    }
  }

  updateTestDrie(form: FormGroup) {
    const { valid, value } = form;
    if (valid && this.emptyForm(form)) {
      if(this.branch?.configuration?.subscriptions?.adtorque && (this.testDrive.source === 'PRE_OWNED' || this.testDrive.source === 'PRE_OWNED_STREAM')) {

        this.update.emit({ ...this.testDrive, payload: {
          ...this.testDrive.payload,
          actualDateAndTime: {
            startTime: value?.payload?.actualDateAndTime?.startTime?.iso,
            endTime: value?.payload?.actualDateAndTime?.endTime?.iso,
          }
        }});
      } else {
        this.update.emit({ ...this.testDrive, ...value });
      }
    }
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    const date = this.date.value as Moment;

    this.calendarChange.emit({
      filter: {
        type: this.testDrive.type,
        modelUuid: this.testDrive.unit?.modelUuid ?? '',
        branchUuid: this.testDrive.branch?.uuid,
        month: date.month() + 1,
        year: date.year(),
      },
      adtorque: (this.branch?.configuration?.subscriptions?.adtorque && (this.testDrive.source === 'PRE_OWNED' || this.testDrive.source === 'PRE_OWNED_STREAM'))
        ? true
        : false,
    });

    datepicker.close();
  }

  selected(date: Date) {
    this.endTime.patchValue(date);
  }

  get minDate() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate());
    return currentDate;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.TestDrive.UPDATE_TEST_DRIVE]
    ) {
      return true;
    }
    return false;
  }

  get payload(): FormGroup {
    return <FormGroup>this.form.get('payload');
  }

  get saleAdvisorUuid(): FormControl {
    return <FormControl>this.payload.get('saleAdvisorUuid');
  }

  get actualDateAndTimeGroup(): FormGroup {
    return <FormGroup>this.payload.get('actualDateAndTime');
  }

  get startTime(): FormControl {
    return <FormControl>this.actualDateAndTimeGroup.get('startTime');
  }

  get endTime(): FormControl {
    return <FormControl>this.actualDateAndTimeGroup.get('endTime');
  }

  emptyForm(form: FormGroup) {
    const { value } = form;
    traverseAndRemove(value);
    return Object.keys(value).length;
  }

  payloadGroup(): FormGroup {
    return this.fb.group({
      saleAdvisorUuid: [''],
      actualDateAndTime: this.fb.group({
        startTime: [''],
        endTime: [''],
      }),
    });
  }
}
