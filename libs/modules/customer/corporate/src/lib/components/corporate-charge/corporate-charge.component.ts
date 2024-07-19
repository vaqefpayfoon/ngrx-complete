import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

// Angular forms
import { FormGroup, FormArray } from '@angular/forms';

// Models
import { ICorporates } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-corporate-charge',
  templateUrl: './corporate-charge.component.html',
  styleUrls: [
    './corporate-charge.component.scss',
    '../corporate-form/corporate-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorporateChargeComponent {
  @Input() parent: FormGroup;

  @Input() corporate: ICorporates.IDocument;

  @Input() permissions: any;

  @Output() added = new EventEmitter<any>();
  @Output() removed = new EventEmitter<any>();
  @Output() created = new EventEmitter<boolean>();
  @Output() updated = new EventEmitter<boolean>();

  @Output() action = new EventEmitter<string>();

  departments = ICorporates.Departments;

  onAdd() {
    this.added.emit();
  }

  onRemove(index: number) {
    if (this.peopleInCharges.length !== 1) {
      this.removed.emit(index);
    }
  }

  onSave(form: FormGroup) {
    // Check it've saved
    if (this.corporate && this.corporate.uuid) {
      // create new people In Charges
      this.updated.emit(form.value);
    } else {
      // Update new people In Charges
      this.created.emit(form.value);
    }
  }

  get peopleInCharge() {
    return this.parent.get('peopleInCharge') as FormArray;
  }

  get peopleInCharges() {
    return (this.parent.get('peopleInCharge') as FormArray).controls;
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
      this.permissions[permissionTags.Corporate.CREATE_CORPORATE]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.UPDATE_CORPORATE]
    ) {
      return true;
    }
    return false;
  }
}
