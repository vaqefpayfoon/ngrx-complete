import {
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

//Forms
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

//Auth
import { Auth } from '@neural/auth';

//Models
import { IPurchases, ISales } from '../models';

//rxjs
import { Subscription } from 'rxjs/Rx';

//Functions
import { traverseAndRemove } from '../functions';

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
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

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

@Directive({
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export abstract class SearchDirective implements OnChanges {
  @Input() filters: ISales.IFilter;

  @Input() purchases: IPurchases.IDocument;

  @Input() downloadedReportUrl: string;

  @Input() selectedCorporate: Auth.ICorporates;

  @Input() selectedBranch: Auth.IBranch;

  @Output() searched = new EventEmitter<ISales.ISearch>();

  @Output() download = new EventEmitter<IPurchases.IDownloadReport>();

  @Input() permissions: any;

  form!: FormGroup;

  downloadForm: FormGroup;

  subscribtion: Subscription;

  panelOpenState = true;

  abstract onReset(): void;

  abstract initialForm(): FormGroup;

  abstract initDownloadForm(): FormGroup;

  constructor(protected fb: FormBuilder) {
    this.form = this.initialForm();
    this.downloadForm = this.initDownloadForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filters && changes.filters.currentValue) {
      this.form.patchValue(this.filters);
    }

    if (!this.filters) {
      this.onReset();
    }
  }

  downloadFile(url: string) {
    window.open(url, '_blank');
  }

  onSearch(form: FormGroup): void {
    const { valid, value } = form;

    if (valid) {
      traverseAndRemove(value);
      this.searched.emit(value);
    }
  }

  changeStartDate({ value }: MatDatepickerInputEvent<Date>) {
    this.from.patchValue(moment(value).toISOString());
    this.to.enable();
    this.to.setValidators(Validators.compose([Validators.required]));
    this.to.markAsTouched();
    this.to.updateValueAndValidity();
  }

  changeEndDate({ value }: MatDatepickerInputEvent<Date>) {
    this.to.patchValue(moment(value).toISOString());
    this.onSearch(this.form);
  }

  clearDate(form: FormGroup): void {
    this.createdAt.reset();
    this.to.disable();
    this.to.clearValidators();
    this.to.updateValueAndValidity();
    this.onSearch(form);
  }

  get referenceNumber(): FormControl {
    return this.form.get('referenceNumber') as FormControl;
  }

  get account(): FormGroup {
    return this.form.get('account') as FormGroup;
  }

  get email(): FormControl {
    return this.account.get('email') as FormControl;
  }

  get createdAt(): FormGroup {
    return this.form.get('createdAt') as FormGroup;
  }

  get from(): FormControl {
    return this.createdAt.get('from') as FormControl;
  }

  get to(): FormControl {
    return this.createdAt.get('to') as FormControl;
  }

  get saleStatus(): FormControl {
    return this.form.get('status') as FormControl;
  }

  get corporateUuid(): FormControl {
    return this.downloadForm.get('corporateUuid') as FormControl;
  }

  get branchUuid(): FormControl {
    return this.downloadForm.get('branchUuid') as FormControl;
  }
}
