import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';

// Angular Form Builder
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

// Models
import { IGroup } from '../../models';

// Location
import { Location } from '@angular/common';

// Permission Tags
import { permissionTags } from '@neural/shared/data';
import { Auth } from '@neural/auth';

@Component({
  selector: 'neural-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupFormComponent implements OnChanges {
  exists = false;

  @Input()
  group: IGroup.IDocument;

  @Input()
  roles: IGroup.IRole[];

  @Input()
  error: any;

  @Input()
  permissions: any;

  @Input() selectedCorporate: Auth.ICorporates;

  @Output()
  create: EventEmitter<IGroup.IDocument> = new EventEmitter<IGroup.IDocument>();

  @Output()
  update: EventEmitter<IGroup.IDocument> = new EventEmitter<IGroup.IDocument>();

  @Output()
  loaded: EventEmitter<IGroup.IDocument> = new EventEmitter<IGroup.IDocument>();

  @Output() corporateChange = new EventEmitter<boolean>();

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    roleUuids: [[], Validators.required]
  });

  constructor(private fb: FormBuilder, private location: Location) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.group && this.group.uuid) {
      this.loaded.emit(this.group);

      this.exists = true;
      this.form.patchValue(this.group);

      this.form.disable();
    }

    if (changes && changes.error && !changes.error.firstChange) {
      this.form.enable();
    }

    if (changes.selectedCorporate && !changes.selectedCorporate.firstChange) {
      this.corporateChange.emit(true);
    }
  }

  get name() {
    return this.form.get('name');
  }

  get selectedRoles() {
    return this.form.get('roleUuids').value;
  }

  get formDisabled() {
    return this.form.disabled;
  }

  get valid() {
    return this.form.valid;
  }

  get touched() {
    return this.form.touched;
  }

  updateGroup(form: FormGroup) {
    const { valid, value, touched } = form;

    if (valid && touched && this.updatePermission) {
      this.update.emit({
        ...this.group,
        ...value
      });

      this.form.disable();
    }
  }

  enable() {
    this.form.enable();
    this.form.get('name').disable();
  }

  cancel() {
    if (this.exists) {
      this.form.patchValue(this.group);
      // enable form
      this.exists = true;

      this.form.disable();
    } else {
      this.location.back();
    }
  }

  createGroup(form: FormGroup) {
    const { value, valid } = form;

    if (valid && this.createPermission) {
      this.create.emit(value);

      this.form.disable();
    }
  }

  roleName(uuid: string): string {
    const index = this.roles.findIndex(role => role.uuid === uuid);
    if (index !== -1) {
      return this.roles[index].name;
    }
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.AccountGroup.CREATE_ACCOUNT_GROUP]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.AccountGroup.UPDATE_ACCOUNT_GROUP]
    ) {
      return true;
    }
    return false;
  }
}
