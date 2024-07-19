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
import { INextService } from '../models';

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
  @Input()
  filters!: INextService.IFilter | null;
  @Input()
  selectedCorporate!: Auth.ICorporates | null;
  @Input()
  selectedBranch!: Auth.IBranch | null;
  @Input()
  nextServices!: INextService.IDocument;
  @Output() searched = new EventEmitter<INextService.ISearch>();

  @Input() permissions: any;
  panelOpenState = true;
  form!: FormGroup;

  subscribtion!: Subscription;


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
    this.estimatedEngineOilService.reset();
    this.to.disable();
    this.to.clearValidators();
    this.to.updateValueAndValidity();
    this.onSearch(form);
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

  get accountEmail(): FormControl {
    return this.account.get('email') as FormControl;
  }

  // get corporateUuid(): FormControl {
  //   return this.form.get('corporateUuid') as FormControl;
  // }
  // get branchUuid(): FormControl {
  //   return this.form.get('branchUuid') as FormControl;
  // }
  get nextService(): FormControl {
    return this.accountVehicleForm.get('nextService') as FormControl;
  }
  get estimatedEngineOilService(): FormControl {
    return this.nextService.get('estimatedEngineOilService') as FormControl;
  }
  get from(): FormControl {
    return this.estimatedEngineOilService.get('from') as FormControl;
  }

  get to(): FormControl {
    return this.estimatedEngineOilService.get('to') as FormControl;
  }

  get accountVehicleForm(): FormGroup {
    return this.form.get('accountVehicle') as FormGroup;
  }

  get vehicleReferenceForm(): FormGroup {
    return this.accountVehicleForm.get('vehicleReference') as FormGroup;
  }
  // get from(): FormControl {
  //   return this.form.get('from') as FormControl;
  // }
  // get to(): FormControl {
  //   return this.form.get('to') as FormControl;
  // }
  get unitForm(): FormGroup {
    return this.vehicleReferenceForm.get('unit') as FormGroup;
  }
  get displayForm(): FormControl {
    return this.unitForm.get('display') as FormControl;
  }
}
