import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';

import { IEmailBranch } from '../../models/email-branches.interface';

import { FormArray } from '@angular/forms';

@Component({
  selector: 'neural-branch-notification-email',
  templateUrl: './branch-notification-email.component.html',
  styleUrls: [
    './branch-notification-email.component.scss',
    '../branch-form/branch-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchEmailModuleComponent implements OnChanges, OnInit {
  form: FormGroup;

  @Input() emailGroup: IEmailBranch;
  
  @Input() formDisabled: boolean;

  constructor(private fb: FormBuilder, private parentForm: FormGroupDirective) {
    this.form = this.fb.group({
      active: [false],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.emailGroup && changes.emailGroup.currentValue) {
      this.form.patchValue(this.emailGroup);
    }
  }

  ngOnInit() {
    this.parentForm.form.addControl('email', this.form);
    if (this.emailGroup || this.parentForm.disabled) {
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
