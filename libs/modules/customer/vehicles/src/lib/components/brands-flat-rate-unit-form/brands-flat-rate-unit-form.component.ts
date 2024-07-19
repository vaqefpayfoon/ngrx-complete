import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBreadCrumb, IError } from '@neural/shared/data';

// Models
import { IBrandsFlatRateUnit } from '../../models';
import { Auth } from '@neural/auth';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  FormArray,
} from '@angular/forms';

// Location
import { Location } from '@angular/common';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-brands-flat-rate-unit-form',
  templateUrl: './brands-flat-rate-unit-form.component.html',
  styleUrls: ['./brands-flat-rate-unit-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandsFlatRateUnitFormComponent implements OnInit, OnChanges {
  @Input() brandsflatRateUnits: IBrandsFlatRateUnit.IDocument[];

  @Input() pendingBrands: string[];

  @Input() permissions: any;

  @Input() error: IError;

  @Input() corporates: Auth.ICorporates[];

  @Output() update = new EventEmitter<IBrandsFlatRateUnit.ISetBrandsFru>();

  bc: IBreadCrumb;

  form = this.fb.group({
    corporateUuid: ['', Validators.required],
    branchUuid: ['', Validators.required],
    flatRateUnits: this.fb.array([]),
  });

  constructor(private fb: FormBuilder, private location: Location) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.brandsflatRateUnits &&
      changes.brandsflatRateUnits.currentValue
    ) {
      this.brandsflatRateUnits.map((bfru) => {
        const flatRateUnit = this.fb.group({
          brand: [bfru.brand, Validators.required],
          hourlyFee: [bfru.hourlyFee, Validators.required],
          unitsPerHour: [bfru.unitsPerHour, Validators.required],
        });

        this.flatRateUnit.push(flatRateUnit);
      });

      this.form.disable();
    }
    if (changes.pendingBrands && changes.pendingBrands.currentValue) {
      this.pendingBrands.map((brand) => {
        const flatRateUnit = this.fb.group({
          brand: [brand, Validators.required],
          hourlyFee: ['', Validators.required],
          unitsPerHour: ['', Validators.required],
        });

        this.flatRateUnit.push(flatRateUnit);
      });

      this.form.disable();
    }

    if (changes.corporates && changes.corporates.currentValue) {
      const [
        {
          uuid: corporateUuid,
          branches: [{ uuid: branchUuid }],
        },
      ] = this.corporates;

      this.corporateUuid.setValue(corporateUuid);
      this.branchUuid.setValue(branchUuid);
    }
  }

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = {
      title: 'Vehicle',
      subtitle: 'Brands Flat unit rate',
      action: 'set',
    };
  }

  emptyFlatRateUnits() {
    while (this.flatRateUnits.length) {
      this.flatRateUnit.removeAt(0);
    }
  }

  updateBrandsFlatRateUnit(form: FormGroup) {
    const { valid, value, touched } = form;

    if (valid && touched) {
      this.update.emit(value);
    }

    this.form.disable();
  }

  cancel() {
    this.location.back();
  }

  get flatRateUnits() {
    return (this.form.get('flatRateUnits') as FormArray).controls;
  }

  get flatRateUnit() {
    return this.form.get('flatRateUnits') as FormArray;
  }

  get corporateUuid() {
    return this.form.get('corporateUuid') as FormControl;
  }

  get branchUuid() {
    return this.form.get('branchUuid') as FormControl;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.SET_BRAND_FRU]
    ) {
      return true;
    }
    return false;
  }
}
