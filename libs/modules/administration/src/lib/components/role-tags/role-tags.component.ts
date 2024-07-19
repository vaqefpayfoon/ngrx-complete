import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  forwardRef
} from '@angular/core';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const ROLE_TAGS_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RoleTagsComponent),
  multi: true
};

// Angular Form Builder
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'neural-role-tags',
  templateUrl: './role-tags.component.html',
  styleUrls: ['./role-tags.component.scss'],
  providers: [ROLE_TAGS_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleTagsComponent implements ControlValueAccessor {
  @Input()
  loading: boolean;

  @Input()
  error: any;

  @Input()
  formDisabled: boolean;

  @Input()
  permissions: string[] = [];

  @Output()
  selected = new EventEmitter();

  value: string[] = [];

  form = this.fb.group({
    filter: ['', Validators.required]
  });

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

  selectPermission(permission: string) {
    if (!this.formDisabled) {
      if (this.existsInPermissions(permission)) {
        this.value = this.value.filter(val => val !== permission);
      } else {
        this.value = [...this.value, permission];
      }

      this.onTouch();
      this.onModelChange(this.value);

      this.selected.emit(permission);
    }

    return false;
  }

  existsInPermissions(permission: string) {
    return this.value.some(val => val === permission);
  }

  constructor(private fb: FormBuilder) {}
}
