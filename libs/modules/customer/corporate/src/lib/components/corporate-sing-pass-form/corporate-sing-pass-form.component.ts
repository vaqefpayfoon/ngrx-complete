import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

// interface
import { IAppFeatureAccountAuthenticationSingPass } from '../../models/sing-pass.interface';

// form
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import {
  addRequiredValidation,
  removeRequiredValidation,
} from '../../functions';

@Component({
  selector: 'neural-corporate-sing-pass-form',
  templateUrl: './corporate-sing-pass-form.component.html',
  styleUrls: [
    './corporate-sing-pass-form.component.scss',
    '../corporate-form/corporate-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorporateSingPassFormComponent implements OnChanges, OnInit {
  @Input() singPass!: IAppFeatureAccountAuthenticationSingPass;

  form: FormGroup;

  constructor(private fb: FormBuilder, private parentForm: FormGroupDirective) {
    this.form = this.fb.group({
      active: [false],
      attributes: [''],
      callback: this.fb.group({
        url: [''],
        token: [''],
      }),
      client: this.fb.group({
        id: [''],
        secret: [''],
      }),
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes.singPass && changes.singPass.currentValue) {
      this.form.patchValue(this.singPass);

      await this.changeRequiredValidation(this.singPass.active);
    }
  }

  ngOnInit(): void {
    this.parentForm.form.addControl('singPass', this.form);
  }

  async changeActive(event: MatSlideToggleChange): Promise<void> {
    const { checked } = event;

    await this.changeRequiredValidation(checked);
  }

  private async changeRequiredValidation(checked: boolean): Promise<void> {
    checked
      ? await addRequiredValidation(this.form)
      : await removeRequiredValidation(this.form);
  }
}
