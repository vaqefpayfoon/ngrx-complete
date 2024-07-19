import {
  Component,
  ChangeDetectionStrategy,
  Input,
  forwardRef
} from '@angular/core';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const CURRENCY_TAGS_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CurrencyTagsComponent),
  multi: true
};

@Component({
  selector: 'neural-currency-tags',
  templateUrl: './currency-tags.component.html',
  styleUrls: ['./currency-tags.component.scss'],
  providers: [CURRENCY_TAGS_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyTagsComponent implements ControlValueAccessor {
  @Input()
  formDisabled: boolean;

  @Input() currencies: string[] = [];

  value: string[] = [];

  onModelChange: any = () => {};
  onTouch: any = () => {};

  registerOnChange(fn: Function) {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function) {
    this.onTouch = fn;
  }

  writeValue(value: string[]) {
    this.value = value;
  }

  selectCurrency(currency: string) {
    if (!this.formDisabled) {
      if (this.existsInCurrencies(currency)) {
        this.value = this.value.filter(val => val !== currency);
      } else {
        this.value = [...this.value, currency];
      }

      this.onTouch();
      this.onModelChange(this.value);
    }

    return false;
  }

  existsInCurrencies(currecny: string) {
    return this.value ? this.value.some(val => val === currecny) :  false;
  }
}
