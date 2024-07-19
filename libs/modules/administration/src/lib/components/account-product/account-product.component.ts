import {
  Component,
  ChangeDetectionStrategy,
  Input,
  forwardRef
} from '@angular/core';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const PRODUCT_TAGS_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AccountProductComponent),
  multi: true
};

@Component({
  selector: 'neural-account-product',
  templateUrl: './account-product.component.html',
  styleUrls: ['./account-product.component.scss'],
  providers: [PRODUCT_TAGS_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountProductComponent implements ControlValueAccessor {
  @Input() products: any;

  @Input()
  formDisabled: boolean;

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

  selectProduct(product: string) {
    if (!this.formDisabled) {
      if (this.existsInProducts(product)) {
        this.value = this.value.filter(val => val !== product);
      } else {
        this.value = [...this.value, product];
      }

      this.onTouch();
      this.onModelChange(this.value);
    }

    return false;
  }

  existsInProducts(product: string) {
    return this.value ? this.value.some(val => val === product) : false;
  }
}
