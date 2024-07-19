import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';

import {  ISmsBranch } from '../../models/email-branches.interface';

import { FormArray } from '@angular/forms';

@Component({
  selector: 'neural-branch-notification-sms',
  templateUrl: './branch-notification-sms.component.html',
  styleUrls: [
    './branch-notification-sms.component.scss',
    '../branch-form/branch-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchSmsModuleComponent implements OnChanges, OnInit {
  form: FormGroup;

  @Input() smsGroup: ISmsBranch;
  
  @Input() formDisabled: boolean;

  constructor(private fb: FormBuilder, private parentForm: FormGroupDirective) {
    this.form = this.fb.group({
      active: [false],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.smsGroup && changes.smsGroup.currentValue) {
      this.form.patchValue(this.smsGroup);
    }
  }

  ngOnInit() {
    this.parentForm.form.addControl('sms', this.form);
    if (this.smsGroup || this.parentForm.disabled) {
      this.parentForm.form.disable();
    }
  }

  get parentFormGroup(): FormGroup {
    return this.parentForm.form as FormGroup;
  }

  get modules(): FormArray {
    return this.form.controls.modules as FormArray;
  }
}
