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
} from '@angular/forms';

// interfaces
import { ModuleSmsTitles } from '../../models/email-branches.enum';

import { MatSelectChange } from '@angular/material/select';
import { ISmsModuleBranch } from '../../models/sms-module.interface';

@Component({
  selector: 'neural-sms-module',
  templateUrl: './sms-module.component.html',
  styleUrls: [
    './sms-module.component.scss',
    '../branch-form/branch-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmsModuleComponent implements OnChanges, OnInit {
  @Input() smsModule!: ISmsModuleBranch[];

  @Input() formDisabled: boolean;

  form: FormGroup;

  constructor(private fb: FormBuilder, private parentForm: FormGroupDirective) {
    this.form = this.fb.group({
      modules: this.fb.array([]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.smsModule && changes.smsModule.currentValue) {
      this.emptySmsModuleBranch();

      for (const event of this.smsModule) {
        this.addSmsModuleBranch(event);
      }
    }
  }

  ngOnInit(): void {
    this.parentForm.form.addControl('modules', this.form.controls.modules);

    this.parentForm.form.disable();
    if (this.smsModule || this.parentForm.disabled) {
      this.parentForm.form.disable();
    }
  }

  private createSmsModuleBranch(): FormGroup {
    return this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      key: ['', Validators.compose([Validators.required])],
      active: [false, Validators.compose([Validators.required])],
    });
  }


  private emptySmsModuleBranch(): void {
    while (this.modules.controls.length) {
      this.modules.removeAt(0);
    }
  }

  private keyControl(index: number): FormControl {
    return this.modules.controls[index].get('key') as FormControl;
  }

  removeSmsModuleBranch(index: number): void {
    this.modules.removeAt(index);
  }

  addSmsModuleBranch(smsModuleBranch?: ISmsModuleBranch): void {
    if (smsModuleBranch) {
      const createSmsModuleBranch = this.fb.group({
        title: [smsModuleBranch.title],
        key: [smsModuleBranch.key],
        active: [smsModuleBranch.active],
      });

      this.modules.push(createSmsModuleBranch);
    } else {
      this.modules.push(this.createSmsModuleBranch());
    }
  }

  onChangeTitle(event: MatSelectChange, index: number) {
    const { value } = event;

    for (const key in ModuleSmsTitles) {
      if (
        Object.prototype.hasOwnProperty.call(ModuleSmsTitles, key) &&
        ModuleSmsTitles[key] === value
      ) {
        this.keyControl(index).patchValue(key);
      }
    }
  }

  moduleIndex(index: number): FormGroup {
    return this.modules.controls[index] as FormGroup;
  }

  get modules(): FormArray {
    return this.form.controls.modules as FormArray;
  }

  get moduleSmsTitles() {
    return ModuleSmsTitles;
  }
}
