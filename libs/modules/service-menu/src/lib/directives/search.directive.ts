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
} from '@angular/forms';

//Auth
import { Auth } from '@neural/auth';

//Models
import { IServiceLine } from '../models';

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


@Directive({

})
export abstract class SearchDirective implements OnChanges {
  @Input() filters: IServiceLine.IFilter;
  @Input() selectedCorporate: Auth.ICorporates;
  @Input() selectedBranch: Auth.IBranch;
  @Input() serviceLine: IServiceLine.IDocument;
  @Output() searched = new EventEmitter<any>();

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

  get operationCode(): FormControl {
    return this.form.get('operationCode') as FormControl;
  }

  get active(): FormControl {
    return this.form.get('active') as FormControl;
  }

  get isInCustomerApp(): FormControl {
    return this.form.get('isInCustomerApp') as FormControl;
  }

  get service(): FormGroup {
    return this.form.get('service') as FormGroup;
  }

  get title(): FormControl {
    return this.service.get('title') as FormControl;
  }

  get type(): FormControl {
    return this.service.get('type') as FormControl;
  }
}
