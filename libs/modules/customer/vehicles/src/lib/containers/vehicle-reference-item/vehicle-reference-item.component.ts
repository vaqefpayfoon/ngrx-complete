import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IVehicleReference } from '../../models';

// RxJs
import { Observable } from 'rxjs';

// facade
import { VehicleReferenceFacade } from '../../+state/facades';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Auth
import { AuthFacade, Auth, PermissionValidatorService } from '@neural/auth';

@Component({
  selector: 'neural-vehicle-reference-item',
  templateUrl: './vehicle-reference-item.component.html',
  styleUrls: ['./vehicle-reference-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleReferenceItemComponent implements OnInit, OnDestroy {
  bc: IBC[];

  title = 'Create a new vehicle reference';

  reference$: Observable<IVehicleReference.IDocument>;
  loading$: Observable<boolean>;

  permissions$: Observable<{}>;

  list$: Observable<{
    brands: string[];
    models: string[];
    variants: IVehicleReference.IVariants[];
  }>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  constructor(
    private vehicleReferenceFacade: VehicleReferenceFacade,
    private permissionValidatorService: PermissionValidatorService,
    private authFacade: AuthFacade
  ) {}

  ngOnInit() {
    this.initialData();
  }
  
  ngOnDestroy() {
    this.vehicleReferenceFacade.onResetSelectedVehicleReference();
  }
  

  initialData() {
    this.bc = [
      {
        name: 'Administration',
        path: null
      },
      {
        name: 'Configuration',
        path: null
      },
      {
        name: 'Vehicle References',
        path: '/app/customer/vehicles/references'
      },
      {
        name: 'Create',
        path: null
      }
    ];

    this.reference$ = this.vehicleReferenceFacade.reference$;
    this.list$ = this.vehicleReferenceFacade.list$;
    this.loading$ = this.vehicleReferenceFacade.loading$;

    this.selectedCorporate$ = this.authFacade.selectedCorporate;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Vehicle.CREATE_VEHICLE_REFERENCE,
      permissionTags.Vehicle.UPDATE_VEHICLE_REFERENCE
    ]);
  }

  onVehicleReferenceLoad({
    type,
    unit: { brand, model }
  }: IVehicleReference.IDocument) {
    this.vehicleReferenceFacade.onLoadBrand(type);
    this.vehicleReferenceFacade.onLoadModel(type, brand);
    this.vehicleReferenceFacade.onLoadVariant(type, brand, model.actual);

    this.bc[this.bc.length - 1].name = `${brand} ${model.actual}`;
    this.title = `${brand} ${model.actual}`;
  }

  onTypeChange(event: string) {
    this.vehicleReferenceFacade.onLoadBrand(event);
    this.vehicleReferenceFacade.resetVehicleReferenceList('models');
    this.vehicleReferenceFacade.resetVehicleReferenceList('variants');
  }

  onBrandSelect({ type, brand }: { type: string; brand: string }) {
    this.vehicleReferenceFacade.resetVehicleReferenceList('models');
    this.vehicleReferenceFacade.resetVehicleReferenceList('variants');
    this.vehicleReferenceFacade.onLoadModel(type, brand);
  }

  onModelSelect({
    type,
    brand,
    model
  }: {
    type: string;
    brand: string;
    model: string;
  }) {
    this.vehicleReferenceFacade.resetVehicleReferenceList('variants');
    this.vehicleReferenceFacade.onLoadVariant(type, brand, model);
  }

  onCreateVehicleReference(event: IVehicleReference.IDocument) {
    this.vehicleReferenceFacade.onCreate(event);
  }

  onUpdateVehicleReference(event: IVehicleReference.IDocument) {
    this.vehicleReferenceFacade.onUpdate(event);
  }

  onCorporateChange(event: boolean) {
    if (event) {
      this.vehicleReferenceFacade.onRedirect();
    }
  }
}
