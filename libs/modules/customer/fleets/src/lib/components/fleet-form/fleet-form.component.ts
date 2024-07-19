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
import { IFleet } from '../../models';
import { Auth } from '@neural/auth';

// Angular forms
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Location
import { Location } from '@angular/common';

@Component({
  selector: 'neural-fleet-form',
  templateUrl: './fleet-form.component.html',
  styleUrls: ['./fleet-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FleetFormComponent implements OnChanges {
  @Input() fleet: IFleet.IDocument;

  @Input() branch: Auth.IBranch;

  @Input() permissions: any;

  @Input()
  error: any;

  exists: boolean;

  @Output()
  create: EventEmitter<IFleet.ICreate> = new EventEmitter<IFleet.ICreate>();

  @Output()
  update: EventEmitter<IFleet.IUpdate> = new EventEmitter<IFleet.IUpdate>();

  @Output()
  loaded: EventEmitter<IFleet.IDocument> = new EventEmitter<IFleet.IDocument>();

  @Output() branchChange = new EventEmitter<boolean>();

  form = this.fb.group({
    name: [
      '',
      Validators.compose([Validators.required, Validators.minLength(3)])
    ],
    numberPlate: ['', Validators.compose([Validators.required])],
    branchUuid: ['', Validators.compose([Validators.required])]
  });

  constructor(private fb: FormBuilder,private location: Location) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.branch && !changes.branch.firstChange) {
      this.branchChange.emit(true);
    }

    if (changes.branch && changes.branch.currentValue) {
      this.form.get('branchUuid').patchValue(this.branch.uuid);
    }

    if (changes.fleet && changes.fleet.currentValue) {
      this.exists = true;
      this.loaded.emit(this.fleet);
      this.form.patchValue(this.fleet);
      this.form.disable();
    }
  }

  createFleet(form: FormGroup) {
    const { value, valid } = form;
    if (valid && this.createPermission) {
      this.create.emit(value);
      form.disable();
    }
  }

  updateFleet(form: FormGroup) {
    const { valid, value, touched } = form;

    if (valid && touched && this.updatePermission) {
      this.update.emit({
        ...this.fleet,
        ...value
      });

      this.form.disable();
    }
  }

  cancel() {
    if (this.exists) {
      this.exists = true;
      this.loaded.emit(this.fleet);
      this.form.patchValue(this.fleet);
      this.form.disable();
    } else {
      this.location.back();
    }
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Fleet.CREATE_FLEET]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Fleet.UPDATE_FLEET]
    ) {
      return true;
    }
    return false;
  }
}
