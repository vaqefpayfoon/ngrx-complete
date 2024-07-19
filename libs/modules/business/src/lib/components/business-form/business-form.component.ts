import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

// Models
import { IBusinesses } from '../../models';

// Angular forms
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Location
import { Location } from '@angular/common';

@Component({
  selector: 'neural-business-form',
  templateUrl: './business-form.component.html',
  styleUrls: ['./business-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessFormComponent implements OnChanges {
  @Input() business: IBusinesses.IDocument;

  @Input() permissions: any;

  @Input()
  error: any;

  exists: boolean;

  @Output()
  create: EventEmitter<IBusinesses.ICreate> = new EventEmitter<
    IBusinesses.ICreate
  >();

  @Output()
  update: EventEmitter<IBusinesses.IUpdate> = new EventEmitter<
    IBusinesses.IUpdate
  >();

  @Output()
  loaded: EventEmitter<IBusinesses.IDocument> = new EventEmitter<
    IBusinesses.IDocument
  >();

  @Output() branchChange = new EventEmitter();

  form = this.fb.group({
    name: [
      '',
      Validators.compose([Validators.required, Validators.minLength(3)])
    ],
    registrationNumber: ['', Validators.compose([Validators.required])],
    description: ['', Validators.compose([Validators.required])]
  });

  constructor(private fb: FormBuilder, private location: Location) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.business && changes.business.currentValue) {
      this.exists = true;
      this.loaded.emit(this.business);
      this.form.patchValue(this.business);
      this.form.disable();
    }
  }

  createBusiness(form: FormGroup) {
    const { value, valid } = form;
    if (valid && this.createPermission) {
      this.create.emit(value);
      form.disable();
    }
  }

  updateBusiness(form: FormGroup) {
    const { valid, value, touched } = form;

    if (valid && touched && this.updatePermission) {
      this.update.emit({
        ...this.business,
        ...value
      });

      this.form.disable();
    }
  }

  cancel() {
    if (this.exists) {
      this.exists = true;
      this.loaded.emit(this.business);
      this.form.patchValue(this.business);
      this.form.disable();
    } else {
      this.location.back();
    }
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Business.CREATE_BUSINESS]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Business.UPDATE_BUSINESS]
    ) {
      return true;
    }
    return false;
  }
}
