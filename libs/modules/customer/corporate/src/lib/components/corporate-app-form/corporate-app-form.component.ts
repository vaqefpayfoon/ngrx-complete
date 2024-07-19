import {
  Component,
  ChangeDetectionStrategy,
  OnChanges,
  Input,
  SimpleChanges,
  EventEmitter,
  Output
} from '@angular/core';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
  FormControl
} from '@angular/forms';

// Models
import { IApps, ICorporates } from '../../models';

// Material select
import { MatSelectChange } from '@angular/material/select';

// Location
import { Location } from '@angular/common';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-corporate-app-form',
  templateUrl: './corporate-app-form.component.html',
  styleUrls: ['./corporate-app-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorporateAppFormComponent implements OnChanges {
  @Input() corporate: ICorporates.IDocument;

  @Input() app: IApps.IDocument;

  @Input() permissions: any;

  @Output()
  create: EventEmitter<IApps.ICreate> = new EventEmitter<IApps.ICreate>();

  @Output()
  update: EventEmitter<IApps.IDocument> = new EventEmitter<IApps.IDocument>();

  @Output()
  loaded = new EventEmitter<{
    app?: IApps.IDocument;
    corporate: ICorporates.IDocument;
  }>();

  exists: boolean;

  editable: boolean;

  appTypes = IApps.AppTypes;

  form = this.fb.group({
    corporateUuid: ['', Validators.compose([Validators.required])],
    name: ['', Validators.compose([Validators.required])],
    type: ['', Validators.compose([Validators.required])],
    payload: this.fb.group({
      iosBundleId: ['', Validators.compose([Validators.required])],
      androidPackageName: ['', Validators.compose([Validators.required])]
    })
  });

  constructor(private fb: FormBuilder, private location: Location) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.corporate && changes.corporate.currentValue) {
      // patch corporateUuid
      this.corporateUuid.patchValue(this.corporate.uuid);

      this.loaded.emit({ corporate: this.corporate });
    }

    if (changes.app && changes.app.currentValue) {
      const { corporateUuid, name, type, payload } = this.app;

      const app = {
        corporateUuid,
        name,
        type,
        payload
      };

      if (type.toUpperCase() === IApps.AppTypes.SALESFORCE.toUpperCase()) {
        delete app.payload;
      }

      this.form.patchValue(app);

      this.exists = true;

      this.form.disable();
    }

    if (this.app && this.corporate) {
      this.loaded.emit({ app: this.app, corporate: this.corporate });
    }
  }

  get formDisabled() {
    return this.form.disabled;
  }

  get corporateUuid() {
    return this.form.get('corporateUuid') as FormControl;
  }

  get name() {
    return this.form.get('name') as FormControl;
  }

  get type() {
    return this.form.get('type') as FormControl;
  }

  get payload() {
    return this.form.get('payload') as FormGroup;
  }

  onChangeType(event: MatSelectChange) {
    const { value } = event;

    value.toUpperCase() === IApps.AppTypes.IONIC.toUpperCase()
      ? this.payload.enable()
      : this.payload.disable();
  }

  behaviourForm(event: boolean) {
    if (event) {
      if (!!this.app) {
        this.form.reset();
        const { corporateUuid, name, type, payload } = this.app;

        const app: IApps.ICreate = {
          corporateUuid,
          name,
          type,
          payload
        };

        if (type.toUpperCase() === IApps.AppTypes.SALESFORCE.toUpperCase()) {
          delete app.payload;
        }

        this.form.patchValue(app);

        this.exists = true;

        return this.form.disable();
      }
      return this.location.back();
    } else {
      if (this.app && this.updatePermission) {
        this.form.enable();

        this.app.type.toUpperCase() === IApps.AppTypes.IONIC.toUpperCase()
          ? this.payload.enable()
          : this.payload.disable();

        this.type.disable();
      }
    }
  }

  createApp(form: FormGroup) {
    const { valid, value } = form;
    if (valid && this.createPermission) {
      this.create.emit(value);
    }
  }

  updateApp(form: FormGroup) {
    const { valid, value, pristine } = form;
    if (valid && !pristine && this.updatePermission) {
      this.update.emit({
        ...this.app,
        ...value
      });
    }
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.CREATE_CORPORATE_APP]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.UPDATE_CORPORATE_APP]
    ) {
      return true;
    }
    return false;
  }
}
