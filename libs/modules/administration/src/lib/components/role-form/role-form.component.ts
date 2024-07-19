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
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';

// Models
import { IRole } from '../../models';

// Location
import { Location } from '@angular/common';

// Permission Tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleFormComponent implements OnChanges {
  exists = false;

  @Input()
  accountPermissions: any;

  @Input() isSuperAdmin: boolean;

  @Input() tagPermissions: any;

  @Input()
  error: any;

  @Input()
  loading: boolean;

  @Input()
  role: IRole.IDocument;

  @Input()
  permissions: string[];

  @Output()
  create: EventEmitter<IRole.IDocument> = new EventEmitter<IRole.IDocument>();

  @Output()
  update: EventEmitter<IRole.IDocument> = new EventEmitter<IRole.IDocument>();

  @Output()
  loaded: EventEmitter<IRole.IDocument> = new EventEmitter<IRole.IDocument>();

  form = this.fb.group({
    name: ['', Validators.required],
    permissions: [[], Validators.required],
    isVisible: [false, Validators.required]
  });

  constructor(private fb: FormBuilder, private location: Location) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.role && changes.role.currentValue) {
      this.loaded.emit(this.role);
      this.form.patchValue(this.role);

      this.form.disable();
      this.exists = true;
    }

    if (this.isSuperAdmin) {
      this.form.addControl(
        'isSuperAdminRole',
        this.fb.control(false, Validators.required)
      );
      if(this.exists){
        this.form.disable();
      }
    }
  }

  get name() {
    return this.form.get('name');
  }

  get selectedPermissions() {
    return this.form.get('permissions').value;
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

  updateRole(form: FormGroup) {
    const { valid, value, touched } = form;

    if (valid && touched) {
      this.update.emit({
        ...this.role,
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
      this.form.patchValue(this.role);
      // enable form
      this.exists = true;

      this.form.disable();
    } else {
      this.location.back();
    }
  }

  createRole(form: FormGroup) {
    const { value, valid } = form;

    if (valid) {
      this.create.emit(value);

      this.form.disable();
    }
  }

  get createPermission() {
    if (
      this.tagPermissions &&
      this.tagPermissions[permissionTags.AccountRole.CREATE_ACCOUNT_ROLE]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.tagPermissions &&
      this.tagPermissions[permissionTags.AccountRole.UPDATE_ACCOUNT_ROLE]
    ) {
      return true;
    }
    return false;
  }
}
