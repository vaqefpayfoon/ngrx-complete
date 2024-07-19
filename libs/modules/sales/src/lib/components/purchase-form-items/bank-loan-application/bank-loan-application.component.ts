import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

// Angular Form Builder
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormGroupDirective,
} from '@angular/forms';

// Models
import { ICorporates } from '@neural/modules/customer/corporate';

// Bank JSon
import banksJson from '@nerv/banks';
import { IBankLoan } from '../../../models';
import { FormArray } from '@angular/forms';

//Permission
import { permissionTags } from '@neural/shared/data';

const CUSTOM_INPUT_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BankLoanApplicationComponent),
  multi: true,
};

@Component({
  selector: 'neural-bank-loan-application',
  templateUrl: './bank-loan-application.component.html',
  styleUrls: [
    './bank-loan-application.component.scss',
    '../../purchase-form/purchase-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_INPUT_ACCESSOR],
})
export class BankLoanApplicationComponent implements ControlValueAccessor {
  @Input() bankLoan: IBankLoan.ISelfBankLoans;

  @Input() permissions: any;

  @Output() deleteChange = new EventEmitter<number>();

  value: string;

  constructor(private formGroupDirective: FormGroupDirective) {}

  onChange: any = () => {};

  onTouch: any = () => {};

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouch = fn;
  }

  writeValue(value: string): void {
    this.value = value;
  }

  onDelete(uuid: string) {
    const banks = this.formGroupDirective.form.get('loans') as FormArray;

    const index = banks.controls.findIndex(
      (x) => x.get('bankUuid').value === uuid
    );

    if (index !== -1) {
      banks.removeAt(index);
    }
  }

  get bank(): ICorporates.IBankScheme | null {
    return this.banks.find((x) => x.uuid === this.value);
  }

  get banks(): ICorporates.IBankScheme[] {
    return banksJson.bankLists;
  }

  get deletePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.BankLoan.DELETE_BANK_LOAN]
    ) {
      return true;
    }
    return false;
  }
}
