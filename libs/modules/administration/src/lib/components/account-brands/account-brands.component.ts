import {
  Component,
  ChangeDetectionStrategy,
  Input,
  forwardRef,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormArray,
} from '@angular/forms';
import { Observable } from 'rxjs';

import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

import { map, startWith, debounceTime } from 'rxjs/operators';

const BRNADS_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AccountBrandsComponent),
  multi: true,
};

@Component({
  selector: 'neural-account-brands',
  templateUrl: './account-brands.component.html',
  styleUrls: [
    './account-brands.component.scss',
    '../account-form/account-form.component.scss',
  ],
  providers: [BRNADS_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountBrandsComponent
  implements ControlValueAccessor, OnChanges, AfterViewInit {
  @Input() brands: string[];

  @Input() formDisabled = false;

  @ViewChild('brandInput') brandInput: ElementRef<HTMLInputElement>;

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  filteredBrands: Observable<string[]>;

  myBrands: string[] = [];

  brandCtrl = new FormControl('');

  onModelChange: any = () => {};
  onTouch: any = () => {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.formDisabled && changes.formDisabled.currentValue) {
      this.formDisabled ? this.brandCtrl.disable() : this.brandCtrl.enable();
    }
  }

  ngAfterViewInit() {
    this.filteredBrands = this.brandCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      map((brand: string | null) =>
        brand ? this._filter(brand) : this.brands ? this.brands.slice() : []
      )
    );
  }

  registerOnChange(fn: Function) {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function) {
    this.onTouch = fn;
  }

  writeValue(value: string[]) {
    const brands = value ? value : [];

    this.myBrands = [...brands];
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our brand
    if (value) {
      this.myBrands = [...this.myBrands, value];
    }

    this.brandCtrl.setValue(null);

    this.onTouch();
    this.onModelChange(this.myBrands);
  }

  remove(brand: string): void {
    const index = this.myBrands.indexOf(brand);

    if (index >= 0) {
      this.myBrands.splice(index, 1);

      this.onTouch();
      this.onModelChange(this.myBrands);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const brands = this.myBrands ? this.myBrands : [];

    this.myBrands = [...brands, event.option.viewValue];

    this.brandInput.nativeElement.value = '';
    this.brandCtrl.setValue(null);

    this.onTouch();
    this.onModelChange(this.myBrands);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.brands.filter((brand) =>
      brand.toLowerCase().includes(filterValue)
    );
  }

  isBrandSelected(brand: string): boolean {
    return this.myBrands && this.myBrands.some((x) => x === brand)
      ? true
      : false;
  }
}
