import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

// forms
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  FormArray,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';

// interfaces
import { IModuleEventBranch } from '../../models/email-module.interface';
import {
  BranchNotification,
  EventTitle,
} from '../../models/email-branches.enum';

import { MatSelectChange } from '@angular/material/select';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {} from '@angular/forms';
@Component({
  selector: 'neural-module-event',
  templateUrl: './module-event.component.html',
  styleUrls: [
    './module-event.component.scss',
    '../branch-form/branch-form.component.scss',
    '../email-module/email-module.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModuleEventComponent implements OnChanges, OnInit {
  @Input() moduleEvents!: IModuleEventBranch[];

  @Input() formDisabled: boolean;

  form: FormGroup;

  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(private fb: FormBuilder, private parentForm: FormGroupDirective) {
    this.form = this.fb.group({
      events: this.fb.array([]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.moduleEvents && changes.moduleEvents.currentValue) {
      this.emptyModuleEventBranch();

      for (const event of this.moduleEvents) {
        this.addModuleEventBranch(event);
      }
    }
  }

  ngOnInit(): void {
    this.parentForm.form.addControl('events', this.form.controls.events);

    if (this.moduleEvents) {
      this.form.disable();
    }
  }

  private emptyModuleEventBranch(): void {
    while (this.events.controls.length) {
      this.events.removeAt(0);
    }
  }

  private createModuleEventBranch(): FormGroup {
    return this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      key: ['', Validators.compose([Validators.required])],
      active: [false, Validators.compose([Validators.required])],
      to: ['', Validators.compose([Validators.required])],
      cc: [''],
    });
  }

  private keyControl(index: number): FormControl {
    return this.events.controls[index].get('key') as FormControl;
  }

  removeModuleEventBranch(index: number) {
    this.events.removeAt(index);
  }

  addModuleEventBranch(moduleEventBranch?: IModuleEventBranch): void {
    if (moduleEventBranch) {
      const createModuleEventBranch = this.fb.group({
        title: [
          moduleEventBranch.title,
          Validators.compose([Validators.required]),
        ],
        active: [
          moduleEventBranch.active,
          Validators.compose([Validators.required]),
        ],
        key: [moduleEventBranch.key, Validators.compose([Validators.required])],
        to: [moduleEventBranch.to, Validators.compose([Validators.required])],
        cc: [moduleEventBranch?.cc],
      });

      this.events.push(createModuleEventBranch);
    } else {
      this.events.push(this.createModuleEventBranch());
    }
  }

  onChangeTitle(event: MatSelectChange, index: number) {
    const { value } = event;

    for (const key in EventTitle[this.key.value]) {
      if (
        Object.prototype.hasOwnProperty.call(EventTitle[this.key.value], key) &&
        value === EventTitle[this.key.value][key]
      ) {
        this.keyControl(index).patchValue(key);
        this.keyControl(index).updateValueAndValidity();
      }
    }
  }

  add(event: MatChipInputEvent, index: number): void {
    const value = (event.value || '').trim();

    const cc = this.events.controls[index].get('cc') as FormControl;
    if (value) {
      const updatedValue = cc.value ? [...cc.value, value] : [value];

      cc.patchValue(updatedValue);

      event.input.value = '';
    }
  }

  remove(item: string, index: number): void {
    const cc = this.events.controls[index].get('cc') as FormControl;
    const indexOf = cc.value.indexOf(item);
    if (indexOf >= 0) {
      const value = [...cc.value];
      value.splice(indexOf, 1);

      cc.patchValue(value);
    }
  }

  onChange(
    event: MatCheckboxChange,
    formControl: FormControl | AbstractControl
  ) {
    const sourceValue = event.source.value;

    const { value } = formControl;

    const updatedValue = value ? [...value] : [];

    if (event.checked) {
      formControl.patchValue([...updatedValue, sourceValue]);
    } else {
      const arrayOfValues: string[] = [...updatedValue];

      const index: number = arrayOfValues.indexOf(sourceValue);

      if (index !== -1) {
        arrayOfValues.splice(index, 1);

        formControl.patchValue([...arrayOfValues]);
      }
    }
  }

  get key(): FormControl {
    return this.parentForm.form.get('key') as FormControl;
  }

  get events(): FormArray {
    return this.form.controls.events as FormArray;
  }

  get eventTitle(): typeof EventTitle {
    return EventTitle;
  }

  get branchNotification(): typeof BranchNotification {
    return BranchNotification;
  }
}
