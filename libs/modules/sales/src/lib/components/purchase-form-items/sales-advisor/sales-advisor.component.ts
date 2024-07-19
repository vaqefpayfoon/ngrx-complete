import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';

// Models
import { IPurchases } from '../../../models';

import { IAccount, ISalesAdvisor } from '@neural/modules/administration';

// angular forms
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

//Permission
import { permissionTags } from '@neural/shared/data';
import { Observable, of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'neural-sales-advisor',
  templateUrl: './sales-advisor.component.html',
  styleUrls: [
    './sales-advisor.component.scss',
    '../../purchase-form/purchase-form.component.scss',
  ],
})
export class SalesAdvisorComponent implements OnChanges, OnInit {
  @Input() purchase: IPurchases.IDocument;

  @Input() salesAdvisors: ISalesAdvisor.ISADocument[];

  @Input() permissions: any;

  @Output() update = new EventEmitter<IPurchases.IUpdate>();

  @Output() badgeChanges = new EventEmitter<IPurchases.IUpdateBadge>();

  filteredOptions: Observable<ISalesAdvisor.ISADocument[]>;

  sa = true;

  form: FormGroup;

  errorMessage: string | null;

  constructor(private fb: FormBuilder) {
    this.form = this.initialSAForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.purchase &&
      changes.purchase.currentValue &&
      this.purchase?.salesAdvisor
    ) {
      this.onCancel(this.purchase?.salesAdvisor);
    }
  }

  ngOnInit(): void {
    this.filteredOptions = this.saleAdvisorUuid.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      map((value) => (value ? this._filter(value) : this.salesAdvisors))
    );
  }

  private initialSAForm(): FormGroup {
    return this.fb.group({
      saleAdvisorUuid: ['', Validators.compose([Validators.required])],
    });
  }

  onCancel(value: string | ISalesAdvisor.ISADocument = '') {
    this.saleAdvisorUuid.patchValue(value);
    this.sa = true;
  }

  onReset() {
    this.saleAdvisorUuid.patchValue('');
    this.saleAdvisorUuid.updateValueAndValidity();
    this.errorMessage = null;
  }

  onUpdate(form: FormGroup) {
    const { value, valid } = form;

    this.errorMessage = null;

    if (valid && value.saleAdvisorUuid.hasOwnProperty('uuid')) {
      this.update.emit({
        saleAdvisorUuid: value?.saleAdvisorUuid?.uuid,
      });

      this.sa = false;
    } else {
      this.saleAdvisorUuid.patchValue('');
      this.errorMessage = `Please select a Sales Advisor from the list.`;
    }
  }

  private _filter(
    value: string | ISalesAdvisor.ISADocument
  ): ISalesAdvisor.ISADocument[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : value.identity?.fullName.toLowerCase();

    return this.salesAdvisors.filter((option) =>
      option?.identity?.fullName.toLowerCase().includes(filterValue)
    );
  }

  displayFn(account: ISalesAdvisor.ISADocument): string {
    return account && account?.identity?.fullName
      ? `${account?.identity?.salutation} ${account?.identity?.fullName}`
      : '';
  }

  onClearBadge() {
    const payload: IPurchases.IUpdateBadge = {
      uuid: this.purchase.uuid,
      section: IPurchases.BadgeSection.SALES_ADVISOR,
    };

    this.badgeChanges.emit(payload);
  }

  get saleAdvisorUuid(): FormControl {
    return this.form.get('saleAdvisorUuid') as FormControl;
  }

  get salesAdvisor(): IAccount.IReservationAccount | null {
    const uuid = this.saleAdvisorUuid.value;

    if (!!uuid && !!this.salesAdvisors) {
      return this.salesAdvisors.find((x) => x.uuid === uuid);
    }
    return null;
  }

  get updatePermission() {
    if (this.permissions && this.permissions[permissionTags.Sale.UPDATE_SALE]) {
      return true;
    }
    return false;
  }
}

export function ValidateUuid(
  users: ISalesAdvisor.ISADocument[] | null
): AsyncValidatorFn {

  return (control: AbstractControl) => {
    if (users && users.length) {
      const findOne = users.find((x) => x.uuid === control.value.uuid);

      if (!findOne) {
        return of({ inValidUser: true });
      }
    }

    return of(null);
  };
}
