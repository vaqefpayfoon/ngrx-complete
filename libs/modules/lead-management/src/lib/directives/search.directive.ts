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
import { ILead } from '../models';

//rxjs
import { Subscription } from 'rxjs';

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
  @Input() filters: ILead.IFilter;
  @Input() selectedCorporate: Auth.ICorporates;
  @Input() selectedBranch: Auth.IBranch;
  @Input() leads: ILead.IDocument;
  @Output() searched = new EventEmitter<ILead.ISearch>();
  @Output() clientSearch = new EventEmitter<string>();

  @Input() permissions: any;

  form!: FormGroup;

  subscribtion: Subscription;

  panelOpenState = true;


  abstract initialForm(): FormGroup;
  abstract onReset(): void;
  constructor(protected fb: FormBuilder) {
    this.form = this.initialForm();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filters && changes.filters.currentValue) {
      this.form.patchValue(this.filters);
    }

    if (!this.filters) {
      this.onReset();
    }
  }
  onSearch(form: FormGroup): void {
    const { valid, value } = form;

    if (valid) {
      traverseAndRemove(value);
      this.searched.emit(value);
    }
  }

  get advisorAssigned(): FormControl {
    return this.form.get('advisorAssigned') as FormControl;
  }
  get status(): FormControl {
    return this.form.get('status') as FormControl;
  }
  get account(): FormGroup {
    return this.form.get('account') as FormGroup;
  }
  get salesAdvisor(): FormGroup {
    return this.form.get('salesAdvisor') as FormGroup;
  }
  get salesAdvisorIdentity(): FormGroup {
    return this.salesAdvisor.get('identity') as FormGroup;
  }
  get accountIdentity(): FormGroup {
    return this.account.get('identity') as FormGroup;
  }
  get accountEmail(): FormControl {
    return this.account.get('email') as FormControl;
  }
  get fullNameAccount(): FormControl {
    return this.accountIdentity.get('fullName') as FormControl;
  }
  get fullNameSalesAdvisor(): FormControl {
    return this.salesAdvisorIdentity.get('fullName') as FormControl;
  }
  get corporateUuid(): FormControl {
    return this.form.get('corporateUuid') as FormControl;
  }

  get branchUuid(): FormControl {
    return this.form.get('branchUuid') as FormControl;
  }
}
