import {
  Component,
  ChangeDetectionStrategy,
  Input,
  forwardRef
} from '@angular/core';

// Angular Form Builder
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const COUNTRY_TAGS_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CountryTagsComponent),
  multi: true
};

@Component({
  selector: 'neural-country-tags',
  templateUrl: './country-tags.component.html',
  styleUrls: ['./country-tags.component.scss'],
  providers: [COUNTRY_TAGS_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryTagsComponent implements ControlValueAccessor {
  @Input()
  formDisabled: boolean;

  @Input() states: string[] = [];

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

  selectState(state: string) {
    if (!this.formDisabled) {
      if (this.existsInStates(state)) {
        this.value = this.value.filter(val => val !== state);
      } else {
        this.value = [...this.value, state];
      }

      this.onTouch();
      this.onModelChange(this.value);
    }

    return false;
  }

  existsInStates(state: string) {
    return this.value ? this.value.some(val => val === state) : false;
  }
}
