import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// Angular forms
import { FormGroup, FormArray } from '@angular/forms';

// Models
import { IModels } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-model-spec',
  templateUrl: './model-spec.component.html',
  styleUrls: [
    './model-spec.component.scss',
    '../model-form/model-form.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelSpecComponent {
  @Input() parent: FormGroup;

  @Input() model: IModels.IDocument;

  @Input() permissions: any;

  @Output() added = new EventEmitter<any>();
  @Output() removed = new EventEmitter<any>();
  @Output() created = new EventEmitter<boolean>();
  @Output() updated = new EventEmitter<boolean>();

  @Output() action = new EventEmitter<string>();

  constructor() {}

  onAdd() {
    this.added.emit();
  }

  onRemove(index: number) {
    if (this.specs.length !== 1) {
      this.removed.emit(index);
    }
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

  get spec() {
    return this.parent.get('specs') as FormArray;
  }

  get specs() {
    return (this.parent.get('specs') as FormArray).controls;
  }

  get formDisabled() {
    return this.parent.disabled;
  }

  get specKeys() {
    return IModels.SpecKeys;
  }

  openPanel(trigger: any) {
    if (this.parent.enabled) {
      trigger.openPanel();
    }
  }

  onAction(action: string) {
    this.action.emit(action);
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
}
