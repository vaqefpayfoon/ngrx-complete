import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
} from '@angular/forms';

import { IModels } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'neural-model-sales',
  templateUrl: './model-sales.component.html',
  styleUrls: [
    './model-sales.component.scss',
    '../model-form/model-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelSalesComponent implements OnChanges, OnInit {
  @Input() parent: FormGroup;

  @Input() permissions: any;

  @Output() action = new EventEmitter<string>();

  @Input() model: IModels.IDocument;

  @Output() created = new EventEmitter<boolean>();

  @Output() updated = new EventEmitter<boolean>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.parent && changes.parent.currentValue) {
      this.parent.markAllAsTouched();
      this.parent.markAsDirty();
    }
  }

  ngOnInit() {}

  get typeKeys() {
    return IModels.DepositTypes;
  }

  get formDisabled() {
    return this.parent.disabled;
  }

  get sales(): FormGroup {
    return <FormGroup>this.parent.get('sales');
  }

  get deposit(): FormGroup {
    return <FormGroup>this.sales.get('deposit');
  }

  get active(): FormControl {
    return this.sales.get('active') as FormControl;
  }

  get type(): FormControl {
    return this.deposit.get('type') as FormControl;
  }

  get amount(): FormControl {
    return this.deposit.get('amount') as FormControl;
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Model.CREATE_MODEL]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Model.UPDATE_MODEL]
    ) {
      return true;
    }
    return false;
  }

  onAction(action: string) {
    this.action.emit(action);
  }

  onSave(form: FormGroup) {
    // Check it've saved
    if (this.model && this.model.uuid) {
      // create new people In Charges
      if (form.valid) {
        this.updated.emit(form.valid);
      }
    } else {
      // Update new people In Charges
      if (form.valid) {
        this.created.emit(form.valid);
      }
    }
  }

  onChangeType(event: MatSelectChange) {
    this.amount.patchValue('');
    this.amount.clearValidators();

    const validatorsArray: ValidatorFn | ValidatorFn[] = [];

    if (this.active.value === true) {
      validatorsArray.push(Validators.required);
    }

    if (event.value === IModels.DepositTypes.PERCENTAGE) {
      validatorsArray.push(Validators.min(0));
      validatorsArray.push(Validators.max(1));
    }

    this.amount.setValidators(validatorsArray);
    this.amount.updateValueAndValidity();
  }

  onChangeActive(event: MatSlideToggleChange) {
    this.type.patchValue('');
    this.amount.patchValue('');

    if (!event.checked) {
      this.type.clearValidators();
      this.amount.clearValidators();
    } else {
      this.type.setValidators([Validators.required]);
      this.amount.setValidators([Validators.required]);
    }

    this.type.updateValueAndValidity();
    this.amount.updateValueAndValidity();
  }
}
