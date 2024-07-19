import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';

// Models
import { IVehicleReference } from '../../models';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';

// Auto Complete events
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

// Location for Back button
import { Location } from '@angular/common';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Traverse function
import { searchFunc } from '../../functions'; // todo: add to data library

// Auth Library
import { Auth } from '@neural/auth';

@Component({
  selector: 'neural-vehicle-reference-form',
  templateUrl: './vehicle-reference-form.component.html',
  styleUrls: ['./vehicle-reference-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleReferenceFormComponent implements OnChanges {
  @Input() reference: IVehicleReference.IDocument;

  @Input() list: {
    brands: string[];
    models: string[];
    variants: IVehicleReference.IVariants[];
  };

  @Input() permissions: any;

  @Input() selectedCorporate: Auth.ICorporates;

  @Output() create = new EventEmitter<IVehicleReference.ICreate>();

  @Output() update = new EventEmitter<IVehicleReference.IDocument>();

  @Output() typeChange = new EventEmitter<string>();

  @Output() modelChange = new EventEmitter<{ type: string; brand: string }>();
  @Output() variantChange = new EventEmitter<{
    type: string;
    brand: string;
    model: string;
  }>();

  @Output() loadReference = new EventEmitter<IVehicleReference.IDocument>();

  @Output() corporateChange = new EventEmitter<boolean>();

  exists: boolean;

  bikeBodyReferences = IVehicleReference.BikeBodyStyle;
  carBodyReferences = IVehicleReference.CarBodyStyle;
  VehicleTypes = IVehicleReference.VehicleType;
  EngineType = IVehicleReference.EngineType;

  private _activeAvailability = false;
  get activeAvailability(): boolean {
    return this._activeAvailability;
  }
  set activeAvailability(value: boolean) {
    this._activeAvailability = value;
  }

  form = this.fb.group({
    type: ['', Validators.required],
    corporateUuid: ['', Validators.required],
    unit: this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      variant: ['', Validators.required],
      bodyStyle: ['', Validators.required],
    }),
    engine: this.fb.group({
      capacity: [''],
      type: [''],
    }),
    availability: this.fb.group({
      mobileService: [{ value: false, disabled: true }, Validators.required],
      serviceCenter: [{ value: false, disabled: true }, Validators.required],
    }),
    serviceMap: this.fb.group(this.createServiceMap()),
  });

  constructor(private fb: FormBuilder, private location: Location) {
    this.serviceMap.disable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.reference && changes.reference.currentValue) {
      this.exists = true;

      const unit = {
        brand: this.reference.unit.brand,
        model: this.reference.unit.model,
        variant: this.reference.unit.variant,
        bodyStyle:
          IVehicleReference.CarBodyStyle[this.reference.unit.bodyStyle],
      };

      const {
        type,
        availability,
        serviceMap,
        corporateUuid,
        engine,
      } = this.reference;

      const patchValue = {
        corporateUuid,
        type,
        unit,
      };

      this.form.patchValue(patchValue);

      if (this.reference.hasOwnProperty('engine')) {
        this.engine.patchValue(engine);
      }

      if (this.reference.hasOwnProperty('availability')) {
        this.availability.patchValue(availability);
      }

      if (this.reference.hasOwnProperty('serviceMap')) {
        this.serviceMap.patchValue(serviceMap);
      }

      this.loadReference.emit(this.reference);
      this.form.disable();
    }

    if (changes.selectedCorporate && changes.selectedCorporate.currentValue) {
      this.corporateUuid.patchValue(this.selectedCorporate.uuid);
    }

    if (changes.selectedCorporate && !changes.selectedCorporate.firstChange) {
      this.corporateChange.emit(true);
    }
  }

  createVehicleReference(form: FormGroup) {
    const { value } = form;

    searchFunc.traverseAndRemove(value);

    if (this.createPermission) {
      this.create.emit(value);
      this.form.disable();
    }
  }

  updateVehicleReference(form: FormGroup) {
    const { value, touched } = form;

    searchFunc.traverseAndRemove(value);

    if (touched && this.updatePermission) {
      this.update.emit({
        ...this.reference,
        ...value,
      });

      this.form.disable();

      this.exists = true;
    }
  }

  createServiceMap() {
    return {
      battery: {
        partNumbers: [],
      },
      brakePad: {
        partNumbers: {
          frontAxle: [],
          rearAxle: [],
        },
      },
      tyre: {
        partNumbers: {
          frontAxle: [],
          rearAxle: [],
        },
      },
      engineOil: {
        MinimumRequirement: '',
        PartNumbers: {
          filter: [],
        },
      },
    };
  }

  onBrandSelected(event: MatSelectChange) {
    this.unit.get('model').setValue('');
    this.unit.get('variant').setValue('');

    const type = this.type.value;

    this.modelChange.emit({ type, brand: event.value });
  }

  onModelSelected(event: MatSelectChange) {
    this.unit.get('variant').setValue('');

    const type = this.type.value;

    this.variantChange.emit({
      type,
      brand: this.brand.value,
      model: event.value,
    });
  }

  onTypeSelected(event: MatSelectChange) {
    const val = event.value;
    this.typeChange.emit(val);

    this.brand.setValue('');
    this.model.setValue('');
    this.variant.setValue('');

    this.bodyStyle.reset();
  }

  back(): void {
    return this.location.back();
  }

  get unit() {
    return this.form.get('unit') as FormGroup;
  }

  get brand() {
    return this.unit.get('brand') as FormControl;
  }

  get model() {
    return this.unit.get('model') as FormControl;
  }

  get variant() {
    return this.unit.get('variant') as FormControl;
  }

  get type() {
    return this.form.get('type') as FormControl;
  }

  get bodyStyle() {
    return this.unit.get('bodyStyle') as FormControl;
  }

  get engine() {
    return this.form.get('engine') as FormGroup;
  }

  get availability() {
    return this.form.get('availability') as FormGroup;
  }

  get serviceMap() {
    return this.form.get('serviceMap') as FormGroup;
  }

  get corporateUuid() {
    return this.form.get('corporateUuid') as FormControl;
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.CREATE_VEHICLE_REFERENCE]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.UPDATE_VEHICLE_REFERENCE]
    ) {
      return true;
    }
    return false;
  }

  cancel() {
    if (!this.exists) {
      this.back();
    } else {
      this.exists = true;

      const unit = {
        brand: this.reference.unit.brand,
        model: this.reference.unit.model,
        variant: this.reference.unit.variant,
        bodyStyle:
          IVehicleReference.CarBodyStyle[this.reference.unit.bodyStyle],
      };

      const patchValue = {
        type: this.reference.type,
        unit,
      };

      this.form.patchValue(patchValue);

      if (this.reference.hasOwnProperty('engine')) {
        this.engine.patchValue(this.reference.engine);
      }

      this.loadReference.emit(this.reference);
      this.form.disable();
    }
  }

  onChangeAvailability(event: MatSlideToggleChange) {
    this.activeAvailability = event.checked;

    event.checked ? this.availability.enable() : this.availability.disable();
  }
}
