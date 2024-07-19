import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  forwardRef
} from '@angular/core';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const GROUP_TAGS_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => GroupTagsComponent),
  multi: true
};

// Angular Form Builder
import { FormBuilder, Validators } from '@angular/forms';

import { IGroup } from '../../models';

@Component({
  selector: 'neural-group-tags',
  templateUrl: './group-tags.component.html',
  styleUrls: ['./group-tags.component.scss'],
  providers: [GROUP_TAGS_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupTagsComponent implements ControlValueAccessor {
  @Input()
  formDisabled: boolean;

  @Input()
  roles: IGroup.IRole[] = [];

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

  selectRole(role: IGroup.IRole) {
    if (!this.formDisabled) {
      if (this.existsInRoles(role)) {
        this.value = this.value.filter(val => val !== role.uuid);
      } else {
        this.value = [...this.value, role.uuid];
      }

      this.onTouch();
      this.onModelChange(this.value);
    }

    return false;
  }

  existsInRoles(role: IGroup.IRole) {
    return this.value.some(val => val === role.uuid);
  }

  constructor(private fb: FormBuilder) {}
}
