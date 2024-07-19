import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IVehicle } from '../../models';

// RxJs
import { Observable } from 'rxjs';

// facade
import { VehiclesFacade } from '../../+state/facades';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

// Auth
import { Auth, AuthFacade } from '@neural/auth';
import { MatDialog } from '@angular/material/dialog';
import { VehicleConfirmationDialogComponent } from '../../components';

@Component({
  selector: 'neural-vehicle-item',
  templateUrl: './vehicle-item.component.html',
  styleUrls: ['./vehicle-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleItemComponent implements OnInit, OnDestroy {
  bc: IBC[];

  title = 'search';

  vehicle$: Observable<IVehicle.IDocument>;
  searchedVehicle$: Observable<IVehicle.IDocument>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  list$: Observable<{
    brands: string[];
    models: string[];
    variants: IVehicle.IVariants[];
  }>;

  permissions$: Observable<{}>;

  data$: Observable<any>;

  constructor(
    private vehiclesFacade: VehiclesFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.vehiclesFacade.onResetSelectedVehicle();
    this.vehiclesFacade.onResetSearchedVehicle();
  }
  
  initialData() {
    this.bc = [
      {
        name: 'customer',
        path: null,
      },
      {
        name: 'vehicle',
        path: '/app/customer/vehicles',
      },
      {
        name: 'search',
        path: null,
      },
    ];

    this.vehicle$ = this.vehiclesFacade.vehicle$;
    this.searchedVehicle$ = this.vehiclesFacade.searchedVehicle$;
    this.list$ = this.vehiclesFacade.list$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Vehicle.CREATE_VEHICLE,
      permissionTags.Vehicle.UPDATE_VEHICLE,
      permissionTags.Vehicle.GET_VEHICLE,
      permissionTags.Vehicle.ACTIVATE_VEHICLE,
      permissionTags.Vehicle.DEACTIVATE_VEHICLE,
    ]);

    this.selectedCorporate$ = this.authFacade.selectedCorporate;

    this.data$ = this.vehiclesFacade.router$;
  }

  onUpdateVehicle({
    document,
    update,
  }: {
    document: IVehicle.IDocument;
    update: IVehicle.IUpdate;
  }) {
    this.vehiclesFacade.onUpdate(document, update);
  }

  onUpdateSearchedVehicle({
    document,
    update,
  }: {
    document: IVehicle.IDocument;
    update: IVehicle.IUpdate;
  }) {
    this.vehiclesFacade.onUpdateSearchedVehicle(document, update);
  }

  onUpdateTyreSpecs({
    document,
    update,
  }: {
    document: IVehicle.IDocument;
    update: IVehicle.IUpdate;
  }) {
    this.vehiclesFacade.onUpdate(document, update);
  }

  onVehicleLoad({
    uuid,
    vehicleReference: {
      unit: { brand, model, display },
    },
  }: IVehicle.IDocument) {
    this.bc[this.bc.length - 1].name = `${brand} ${display}`;
    this.title = `${brand} ${display}`;

    this.vehiclesFacade.onLoadModel(brand);
    this.vehiclesFacade.onLoadVariant(brand, model.actual);
  }

  onBrandSelect({ brand }: { brand: string }) {
    this.vehiclesFacade.resetListVehicles('models');
    this.vehiclesFacade.resetListVehicles('variants');
    this.vehiclesFacade.onLoadModel(brand);
  }

  onModelSelect({ brand, model }: { brand: string; model: string }) {
    this.vehiclesFacade.resetListVehicles('variants');
    this.vehiclesFacade.onLoadVariant(brand, model);
  }

  onCorporateChange(event: boolean) {
    if (event) {
      this.vehiclesFacade.corporateChange();
    }
  }

  onSearch(numberPlate: string): void {
    if (!!numberPlate) {
      this.vehiclesFacade.onSearchByVehicleNumberPlate(numberPlate);
    }
  }

  openDialog(event: IVehicle.IDocument) {
    const dialogRef = this.dialog.open(VehicleConfirmationDialogComponent, {
      data: event,
      disableClose: true
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        return this.vehiclesFacade.toggleStatus(event);
      } else {
        return this.vehiclesFacade.resetSearchedVehicleToggle(event);
      }
    });
  }

  get vehicleType() {
    return IVehicle.VehicleType;
  }
}
