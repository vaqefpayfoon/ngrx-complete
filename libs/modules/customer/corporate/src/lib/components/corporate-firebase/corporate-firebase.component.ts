import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';

import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';

import { IFirebase } from '../../models';

@Component({
  selector: 'neural-corporate-firebase',
  templateUrl: './corporate-firebase.component.html',
  styleUrls: [
    './corporate-firebase.component.scss',
    '../corporate-configuration/corporate-configuration.component.scss',
    '../pre-ownded/pre-ownded.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorporateFirebaseComponent implements OnChanges, AfterViewInit {
  @Input() firebase!: IFirebase.IFirebaseConfiguration;

  form!: FormGroup;

  constructor(private fb: FormBuilder, private parentForm: FormGroupDirective) {
    this.form = this.initialForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.firebase && changes.firebase.currentValue) {
      this.form.patchValue(this.firebase);
    }
  }

  ngAfterViewInit(): void {
    this.parentForm.form.enable();
    this.parentForm.form.addControl('firebase', this.form);
    this.parentForm.form.disable();
  }

  private initialForm(): FormGroup {
    return this.fb.group({
      customerApp: this.initialAppConfig(),
      operationApp: this.initialAppConfig(),
      adminApp: this.initialAppConfig(),
    });
  }

  private initialAppConfig() {
    return this.fb.group({
      androidPackageName: [''],
      iosBundleId: [''],
      iosStoreId: [''],
      baseUrl: [''],
    });
  }
}
