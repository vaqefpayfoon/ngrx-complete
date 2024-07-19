import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

//Forms
import { FormGroupDirective, FormGroup, FormBuilder } from '@angular/forms';

//Models
import { IModels } from '../../models';
import { OnInit } from '@angular/core';

@Component({
  selector: 'neural-model-pre-owned',
  templateUrl: './model-pre-owned.component.html',
  styleUrls: [
    './model-pre-owned.component.scss',
    '../model-form/model-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelPreOwnedComponent implements OnChanges, OnInit {
  @Input() displayAdditionalInformation: IModels.IDisplayAdditionalInformation;

  form!: FormGroup;

  constructor(private fb: FormBuilder, private parentForm: FormGroupDirective) {
    this.form = this.fb.group({
      pricesExcludingCoe: [false],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.displayAdditionalInformation &&
      changes.displayAdditionalInformation.currentValue
    ) {
      this.form.patchValue(this.displayAdditionalInformation);
    }
  }

  ngOnInit(): void {
    this.parentForm.form.addControl('displayAdditionalInformation', this.form);
    this.form.disable();
  }
}
