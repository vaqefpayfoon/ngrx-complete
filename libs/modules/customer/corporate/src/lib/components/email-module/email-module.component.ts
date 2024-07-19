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
import { IEmailModuleBranch } from '../../models/email-module.interface';
import { ModuleTitles } from '../../models/email-branches.enum';

import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'neural-email-module',
  templateUrl: './email-module.component.html',
  styleUrls: [
    './email-module.component.scss',
    '../branch-form/branch-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailModuleComponent implements OnChanges, OnInit {
  @Input() emailModule!: IEmailModuleBranch[];

  @Input() formDisabled: boolean;

  form: FormGroup;

  constructor(private fb: FormBuilder, private parentForm: FormGroupDirective) {
    this.form = this.fb.group({
      modules: this.fb.array([]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.emailModule && changes.emailModule.currentValue) {
      this.emptyEmailModuleBranch();

      for (const event of this.emailModule) {
        this.addEmailModuleBranch(event);
      }
    }
  }

  ngOnInit(): void {
    this.parentForm.form.addControl('modules', this.form.controls.modules);

    this.parentForm.form.disable();
    if (this.emailModule || this.parentForm.disabled) {
      this.parentForm.form.disable();
    }
  }

  private createEmailModuleBranch(): FormGroup {
    return this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      key: ['', Validators.compose([Validators.required])],
      active: [false, Validators.compose([Validators.required])],
    });
  }

  private emptyEmailModuleBranch(): void {
    while (this.modules.controls.length) {
      this.modules.removeAt(0);
    }
  }

  private keyControl(index: number): FormControl {
    return this.modules.controls[index].get('key') as FormControl;
  }

  removeEmailModuleBranch(index: number): void {
    this.modules.removeAt(index);
  }

  addEmailModuleBranch(emailModuleBranch?: IEmailModuleBranch): void {
    if (emailModuleBranch) {
      const createEmailModuleBranch = this.fb.group({
        title: [emailModuleBranch.title],
        key: [emailModuleBranch.key],
        active: [emailModuleBranch.active],
      });

      this.modules.push(createEmailModuleBranch);
    } else {
      this.modules.push(this.createEmailModuleBranch());
    }
  }

  onChangeTitle(event: MatSelectChange, index: number) {
    const { value } = event;

    for (const key in ModuleTitles) {
      if (
        Object.prototype.hasOwnProperty.call(ModuleTitles, key) &&
        ModuleTitles[key] === value
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

  get moduleTitles() {
    return ModuleTitles;
  }
}
