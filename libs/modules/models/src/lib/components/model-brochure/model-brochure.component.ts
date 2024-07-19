import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// Angular forms
import { FormGroup, FormArray, FormControl } from '@angular/forms';

// Models
import { IModels } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-model-brochure',
  templateUrl: './model-brochure.component.html',
  styleUrls: [
    './model-brochure.component.scss',
    '../model-form/model-form.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelBrochureComponent {
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
    if (this.brochures.length !== -1) {
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

  get brochure() {
    return this.parent.get('brochures') as FormArray;
  }

  get brochures() {
    return (this.parent.get('brochures') as FormArray).controls;
  }

  get formDisabled() {
    return this.parent.disabled;
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
