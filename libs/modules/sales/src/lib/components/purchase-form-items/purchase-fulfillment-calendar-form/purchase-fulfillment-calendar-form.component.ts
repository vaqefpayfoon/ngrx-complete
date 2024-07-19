import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormGroupDirective,
  FormControl,
} from '@angular/forms';

//Permission
import { permissionTags } from '@neural/shared/data';

// Interfaces
import { IPurchases } from '../../../models';
import { ICorporates } from '@neural/modules/customer/corporate';
import { Auth } from '@neural/auth';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { traverseAndRemove } from '../../../functions';
import { MatSelectChange } from '@angular/material/select';

// Moment
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;

import {
  NgxMatDateAdapter,
  NgxMatDateFormats,
  NGX_MAT_DATE_FORMATS,
} from '@angular-material-components/datetime-picker';

import { NgxMatMomentAdapter } from '@angular-material-components/moment-adapter';

// If using Moment
const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: 'LL, LTS',
  },
  display: {
    dateInput: 'LL, LTS',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'neural-purchase-fulfillment-calendar-form',
  templateUrl: './purchase-fulfillment-calendar-form.component.html',
  styleUrls: [
    './purchase-fulfillment-calendar-form.component.scss',
    '../../purchase-form/purchase-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    {
      provide: NgxMatDateAdapter,
      useClass: NgxMatMomentAdapter,
    },
  ],
})
export class PurchaseFulfillmentCalendarFormComponent
  implements OnChanges, OnInit, AfterViewInit {
  @Input() purchase: IPurchases.IDocument;

  @Input() index: number;

  @Input() permissions: any;

  @Input() branches: Auth.IBranch[];

  @Output() updated = new EventEmitter<number>();

  @Output() locked = new EventEmitter<number>();

  form: FormGroup;

  edit = true;

  minDate: string;

  constructor(
    private fb: FormBuilder,
    private parentForm: FormGroupDirective,
    private cd: ChangeDetectorRef
  ) {
    this.form = this.calendarForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.index && changes.index.currentValue) {
      const calendar = this.purchase.fulfillments[this.index].calendar;

      this.form.patchValue(calendar);

      this.edit = true;
    }
  }

  ngOnInit(): void {
    const parent = this.fulfillments.controls[this.index] as FormGroup;

    const calendar = (ICorporates.ModelSaleFulfillmentType
      .CALENDAR as string).toLowerCase();

    parent.addControl(calendar, this.form);

    this.minDate = new Date().toISOString();

    this.cd.detectChanges();
  }

  ngAfterViewInit() {}

  onSearch(event: IPurchases.Location) {
    if (event) {
      this.location.patchValue(event);
    }
  }

  private calendarForm(): FormGroup {
    return this.fb.group({
      date: [''],
      collectionType: [''],
      remark: [''],
      branchUuid: [''],
      location: this.fb.group({
        address: [''],
        latitude: [''],
        longitude: [''],
      }),
      isCollected: [false],
      isRequired: [false, Validators.compose([Validators.required])],
    });
  }

  public changeDate(event: MatDatepickerInputEvent<Date>) {
    this.date.patchValue(event.value.toISOString());
    this.date.updateValueAndValidity();
  }

  onUpdate(form: FormGroup) {
    const { valid, value } = form;

    if (valid) {
      traverseAndRemove(value);
      this.updated.emit(this.index);
    }
  }

  onLock(form: FormGroup): void {
    const { valid, value } = form;

    if (valid) {
      traverseAndRemove(value);
      this.locked.emit(this.index);
    }
  }

  onChangeCollection(event?: MatSelectChange) {
    this.location.reset();
    this.branchUuid.reset();
  }

  get fulfillments(): FormArray {
    return this.parentForm.form.get('fulfillments') as FormArray;
  }

  get saleFulfillmentCalendarStatus() {
    return IPurchases.CalendarStatus;
  }

  get formDisabled(): boolean {
    return this.form.disabled;
  }

  get status(): FormControl {
    return this.form.get('status') as FormControl;
  }

  get date(): FormControl {
    return this.form.get('date') as FormControl;
  }

  get branchUuid(): FormControl {
    return this.form.get('branchUuid') as FormControl;
  }

  get collectionType(): FormControl {
    return this.form.get('collectionType') as FormControl;
  }

  get location(): FormGroup {
    return this.form.get('location') as FormGroup;
  }

  get address(): FormControl {
    return this.location.get('address') as FormControl;
  }

  get branchName(): string | null {
    const branchUuid = this.purchase.fulfillments[this.index]?.calendar
      ?.branchUuid;
    return (
      this.branches.find((branch) => branch.uuid === branchUuid)?.name ?? null
    );
  }

  get collectionTypes() {
    return IPurchases.CollectionType;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Sale.UPDATE_SALE_FULFILLMENT]
    ) {
      return true;
    }
    return false;
  }
}
