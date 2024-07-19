import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IModels } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-model-promotion',
  templateUrl: './model-promotion.component.html',
  styleUrls: [
    './model-promotion.component.scss',
    '../model-form/model-form.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelPromotionComponent implements OnInit {
  @Input() parent: FormGroup;

  @Input() permissions: any;

  @Output() action = new EventEmitter<string>();

  @Input() model: IModels.IDocument;

  @Output() created = new EventEmitter<boolean>();
  @Output() updated = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit() {}

  get formDisabled() {
    return this.parent.disabled;
  }

  get depositTypes() {
    return IModels.DepositTypes;
  }

  get promotion(): FormGroup {
    return <FormGroup>this.parent.get('promotion');
  }

  get discount(): FormGroup {
    return <FormGroup>this.promotion.get('discount');
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

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Model.CREATE_MODEL]
    ) {
      return true;
    }
    return false;
  }
}
