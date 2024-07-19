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
import { IVehicle } from '../../models';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';

// facade
import { VehiclesFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// Auto Complete events
import { MatSelectChange } from '@angular/material/select';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Auth
import { Auth } from '@neural/auth';

@Component({
  selector: 'neural-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleFormComponent implements OnChanges {
  @Input() vehicle: IVehicle.IDocument;

  @Input() searchedVehicle: IVehicle.IDocument;

  @Input() permissions: any;

  @Input() selectedCorporate: Auth.ICorporates;

  @Input()
  list: {
    brands: string[];
    models: string[];
    variants: IVehicle.IVariants[];
  };

  @Output() create = new EventEmitter<IVehicle.ICreate>();

  @Output() update = new EventEmitter<{
    document: IVehicle.IDocument;
    update: IVehicle.IUpdate;
  }>();

  @Output() updateSearchedVehicle = new EventEmitter<{
    document: IVehicle.IDocument;
    update: IVehicle.IUpdate;
  }>();

  @Output()
  updateTyreSpecs = new EventEmitter<{
    document: IVehicle.IDocument;
    update: IVehicle.IUpdate;
  }>();

  @Output() model = new EventEmitter<{ brand: string }>();
  @Output() variant = new EventEmitter<{ brand: string; model: string }>();

  @Output() loadVehicle = new EventEmitter<IVehicle.IDocument>();

  @Output() corporateChange = new EventEmitter<boolean>();

  @Output() status = new EventEmitter<IVehicle.IDocument>();

  tyre$: Observable<IVehicle.ITyre>;
  rearTyre$: Observable<IVehicle.ITyre>;

  carTyreSpecs: any;
  bikeTyreSpecs: any;

  FUELTYPE = IVehicle.FuelType;
  VEHICLETYPE = IVehicle.VehicleVariantType;
  FLEETTYPE = IVehicle.FleetType;
  OWNERTYPE = IVehicle.OwnerType;

  exists: boolean;

  accountForm = this.fb.group({
    identity: this.fb.group({
      salutation: [
        {
          value: '',
          disabled: true,
        },
      ],
      fullName: [
        {
          value: '',
          disabled: true,
        },
        Validators.required,
      ],
    }),
    email: [
      {
        value: '',
        disabled: true,
      },
      Validators.compose([Validators.required, Validators.email]),
    ],
    phone: this.fb.group({
      code: [
        {
          value: '',
          disabled: true,
        },
        ,
        Validators.required,
      ],
      number: [
        {
          value: '',
          disabled: true,
        },
        ,
        Validators.required,
      ],
    }),
  });

  form = this.fb.group({
    accountUuid: ['', Validators.compose([Validators.required])],
    type: ['', Validators.required],
    corporateUuid: ['', Validators.required],
    ownerType: ['', Validators.required],
    fuelType: [''],
    identificationNumber: [''],
    numberPlate: ['', Validators.required],
    vehicleReferenceUuid: ['', Validators.required],
    unit: this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      variant: ['', Validators.required],
    }),
  });

  activeStatus = this.fb.control({value: ''}, [Validators.required]);

  constructor(
    private fb: FormBuilder,
    private vehiclesFacade: VehiclesFacade,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedCorporate && !changes.selectedCorporate.firstChange) {
      this.corporateChange.emit(true);
    }

    if (changes.selectedCorporate && changes.selectedCorporate.currentValue) {
      this.corporateUuid.patchValue(this.selectedCorporate.uuid);
    }

    if (changes.searchedVehicle && !changes.searchedVehicle.currentValue) {
      this.exists = false;
    }

    if (
      (changes.vehicle && changes.vehicle.currentValue) ||
      (changes.searchedVehicle && changes.searchedVehicle.currentValue)
    ) {
      this.loadVehicle.emit(this.vehicle ?? this.searchedVehicle);
      this.exists = true;

      const {
        account,
        ownerType,
        accountUuid,
        numberPlate,
        identificationNumber,
        fuelType,
        bikeTyreSpecs,
        carTyreSpecs,
        active,
        vehicleReference: { type }
      } = this.vehicle ?? this.searchedVehicle;

      if (!!account) {
        this.accountForm.patchValue(account);
      }

      // Temporary not check with vehiclevarianttype enum as old data consist type not existed in vehiclevariant type
      type.includes('CAR') ? this.type.patchValue('CAR') : this.type.patchValue('BIKE');

      const patchValue = {
        numberPlate,
        identificationNumber,
        fuelType,
        ownerType,
        accountUuid,
      };

      this.form.patchValue(patchValue);
      this.active.patchValue(active);

      // Car

      if (carTyreSpecs) {
        const { front, rear } = carTyreSpecs;

        this.carTyreSpecs = {
          frontLeft: front.left,
          frontRight: front.right,
          rearLeft: rear.left,
          rearRight: rear.right,
        };
      }

      // Bike

      if (bikeTyreSpecs) {
        const { front, rear } = bikeTyreSpecs;

        this.bikeTyreSpecs = {
          front,
          rear,
        };
      }

      this.tyre$ = this.vehiclesFacade.tyre$;
      this.rearTyre$ = this.vehiclesFacade.rearTyre$;
      this.form.disable();
    }

    if (
      (changes.vehicle && changes.vehicle.firstChange) ||
      (changes.searchedVehicle && changes.searchedVehicle.firstChange)
    ) {
      this.vehiclesFacade.resetTyreRims();
      this.vehiclesFacade.resetTyreAspectratios();
    }

    if (
      (changes.list && changes.list.currentValue && this.list && this.vehicle) ||
      (changes.list && changes.list.currentValue && this.list && this.searchedVehicle)
    ) {
      const {
        vehicleReference: { unit },
      } = this.vehicle ?? this.searchedVehicle;

      const { variant, model } = unit;

      let modelItem: string;
      let variantItem: IVehicle.IVariants;

      if (this.list?.models) {
        const index = this.list.models.findIndex((x) => x === model.actual);

        if (index !== -1) {
          modelItem = this.list.models[index];
        }
      }

      if (this.list?.variants) {
        const index = this.list.variants.findIndex(
          (x) => x.variant === variant.actual
        );

        if (index !== -1) {
          variantItem = this.list.variants[index];
          this.vehicleReferenceUuid.patchValue(variantItem.uuid);
        }
      }

      if (!!modelItem && !!variantItem) {
        this.unit.patchValue({
          ...unit,
          model: modelItem,
          variant: variantItem.uuid,
        });
      }
    }
  }

  createVehicle(form: FormGroup) {
    const { value, valid } = form;

    if (valid && this.createPermission) {
      this.create.emit(value);
      this.form.disable();

      this.exists = true;
    }
  }

  updateVehicle(form: FormGroup) {
    const { value, valid, touched } = form;

    if (valid && touched && this.updatePermission) {

      if(!!this.vehicle) {
        this.update.emit({
          document: this.vehicle,
          update: value,
        });
      } else {
        this.updateSearchedVehicle.emit({
          document: this.searchedVehicle,
          update: value,
        });
      }

      this.form.disable();

      this.exists = true;
    }
  }

  onUpdateTyreSpecs({ carTyreSpecs, bikeTyreSpecs }: IVehicle.IUpdate) {
    const { uuid, numberPlate, ownerType } = this.vehicle ?? this.searchedVehicle;
    let update: IVehicle.IUpdate = {
      uuid,
      ownerType,
      numberPlate,
      vehicleReferenceUuid: this.vehicleReferenceUuid.value,
    };

    if (this.type.value === IVehicle.FleetType.BIKE) {
      update = {
        ...update,
        bikeTyreSpecs
      };
    }
    if (this.type.value === IVehicle.FleetType.CAR) {
      update = {
        ...update,
        carTyreSpecs
      };
    }

    this.updateTyreSpecs.emit({
      document: this.vehicle ?? this.searchedVehicle,
      update
    });
  }

  updateRearWidth() {
    this.vehiclesFacade.onRearTyreWidths();
  }

  updateRearAspectRatio(width: string) {
    this.vehiclesFacade.onRearTyreAspectratios(width);
  }

  updateRearRim(event: { width: string; aspectRatio: string }) {
    const { width, aspectRatio } = event;
    this.vehiclesFacade.onRearTyreRims(width, aspectRatio);
  }

  updateAspectRatio(width: string) {
    this.vehiclesFacade.onTyreAspectratios(width);
  }

  updateRim(event: { width: string; aspectRatio: string }) {
    const { width, aspectRatio } = event;
    this.vehiclesFacade.onTyreRims(width, aspectRatio);
  }

  onBrandSelected(event: MatSelectChange) {
    this.unit.get('model').setValue('');
    this.unit.get('variant').setValue('');

    if (this.unit.get('manufacturerYear')) {
      this.unit.get('manufacturerYear').setValue('');
    }
    if (this.unit.get('registrationYear')) {
      this.unit.get('registrationYear').setValue('');
    }

    this.model.emit({ brand: event.value });
  }

  onModelSelected(event: MatSelectChange) {
    this.unit.get('variant').setValue('');

    if (this.unit.get('manufacturerYear')) {
      this.unit.get('manufacturerYear').setValue('');
    }
    if (this.unit.get('registrationYear')) {
      this.unit.get('registrationYear').setValue('');
    }

    this.variant.emit({ brand: this.brand.value, model: event.value });
  }

  displayFn(variant?: IVehicle.IVariants): string | undefined {
    return variant ? variant.variant : undefined;
  }

  get corporateUuid() {
    return this.form.get('corporateUuid') as FormControl;
  }

  get unit() {
    return this.form.get('unit') as FormGroup;
  }

  get brand() {
    return this.unit.get('brand') as FormControl;
  }

  get vehicleReferenceUuid() {
    return this.form.get('vehicleReferenceUuid') as FormControl;
  }

  get type() {
    return this.form.get('type') as FormControl;
  }

  get active() {
    return this.activeStatus as FormControl;
  }

  get warrantyPackages(): IVehicle.IWarrantyPackage[] {
    return (this.vehicle ?? this.searchedVehicle)?.warrantyPackages;
  }

  get formDisabled() {
    return this.form.disabled;
  }

  get searchedVehicleStatusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.DEACTIVATE_VEHICLE] &&
      this.permissions[permissionTags.Vehicle.ACTIVATE_VEHICLE]
    ) {
      return true;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.DEACTIVATE_VEHICLE]
    ) {
      return this.permissions[permissionTags.Vehicle.DEACTIVATE_VEHICLE] &&
        this.searchedVehicle.active
        ? true
        : false;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.ACTIVATE_VEHICLE]
    ) {
      return this.permissions[permissionTags.Vehicle.ACTIVATE_VEHICLE] &&
        !this.searchedVehicle.active
        ? true
        : false;
    }

    return false;
  }

  toggleStatus(event?: any) {
    if (this.searchedVehicleStatusPermission) {
      this.status.emit(this.searchedVehicle);
    }
  }

  cancel() {
    if (this.exists) {
      this.loadVehicle.emit(this.vehicle ?? this.searchedVehicle);
      this.exists = true;

      const {
        account: {
          name: { first, last },
          email,
          phone,
        },
        accountUuid,
        numberPlate,
        identificationNumber,
        fuelType,
        bikeTyreSpecs,
        carTyreSpecs,
      } = this.vehicle ?? this.searchedVehicle;

      this.accountForm.patchValue({
        first,
        last,
        email,
        phone,
      });

      const patchValue = {
        numberPlate,
        identificationNumber,
        fuelType,
        accountUuid,
      };

      this.form.patchValue(patchValue);

      // Car

      if (carTyreSpecs) {
        const { front, rear } = (this.vehicle ?? this.searchedVehicle)
          .carTyreSpecs as IVehicle.ICarTyreSpecs;

        this.carTyreSpecs = {
          frontLeft: front.left,
          frontRight: front.right,
          rearLeft: rear.left,
          rearRight: rear.right,
        };
      }

      // Bike

      if (bikeTyreSpecs) {
        const { front, rear } = (this.vehicle ?? this.searchedVehicle)
          .bikeTyreSpecs as IVehicle.IBikeTyreSpecs;

        this.bikeTyreSpecs = {
          front,
          rear,
        };
      }

      this.tyre$ = this.vehiclesFacade.tyre$;
      this.form.disable();

      this.vehiclesFacade.resetTyreRims();
      this.vehiclesFacade.resetTyreAspectratios();

      const {
        vehicleReference: { unit },
      } = this.vehicle ?? this.searchedVehicle;

      const { variant, model } = unit;

      let modelItem: string;
      let variantItem: IVehicle.IVariants;

      if (this.list.models) {
        const index = this.list.models.findIndex((x) => x === model.actual);

        if (index !== -1) {
          modelItem = this.list.models[index];
        }
      }

      if (this.list.variants) {
        const index = this.list.variants.findIndex(
          (x) => x.variant === variant.actual
        );

        if (index !== -1) {
          variantItem = this.list.variants[index];
          this.vehicleReferenceUuid.patchValue(variantItem.uuid);
        }
      }

      if (modelItem && variantItem) {
        this.unit.patchValue({
          ...unit,
          model: modelItem,
          variant: variantItem.uuid,
        });
      }
    } else {
    }
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.CREATE_VEHICLE]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.UPDATE_VEHICLE]
    ) {
      return true;
    }
    return false;
  }

  get inspections() {
    return (this.vehicle ?? this.searchedVehicle).inspections;
  }
}
