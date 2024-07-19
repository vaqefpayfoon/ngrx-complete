import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { ISort, IBC } from '@neural/shared/data';

// Models
import { IVehicleReference, IBrandsFlatRateUnit } from '../../models';

// RxJs
import { Observable } from 'rxjs';

// facade
import {
  VehicleReferenceFacade,
  BrandsFlatRateUnitFacade
} from '../../+state/facades';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

// Dialog
import { VehicleReferenceConfirmationDialogComponent } from '../../components';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

@Component({
  selector: 'neural-vehicle-references',
  templateUrl: './vehicle-references.component.html',
  styleUrls: ['./vehicle-references.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleReferencesComponent implements OnInit {
  references$: Observable<IVehicleReference.IDocument[]>;

  total$: Observable<number>;
  referencesConfig$: Observable<IVehicleReference.IConfig>;

  loading$: Observable<any>;
  error$: Observable<any>;

  permissions$: Observable<{}>;

  // Brands Flat Unit Rate
  totalFRU$: Observable<number>;
  pendingFRU$: Observable<number>;

  brandsFRU$: Observable<IBrandsFlatRateUnit.IDocument[]>;
  remainingBrands$: Observable<string[]>;

  bc: IBC[];
  sort: ISort[];

  search = false;

  pageEvent: PageEvent;

  constructor(
    private vehicleReferenceFacade: VehicleReferenceFacade,
    private brandsFlatRateUnitFacade: BrandsFlatRateUnitFacade,
    private permissionValidatorService: PermissionValidatorService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initialData();
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
        path: null
      }
    ];

    this.sort = [
      {
        Name: 1
      },
      {
        Email: 1
      },
      {
        Phone: 1
      },
      {
        Group: 1
      },
      {
        Status: 1
      }
    ];

    this.loading$ = this.vehicleReferenceFacade.loading$;
    this.error$ = this.vehicleReferenceFacade.error$;
    this.references$ = this.vehicleReferenceFacade.references$;
    this.referencesConfig$ = this.vehicleReferenceFacade.vehicleReferencesConfig$;
    this.total$ = this.vehicleReferenceFacade.total$;

    // FRU
    this.totalFRU$ = this.brandsFlatRateUnitFacade.total$;
    this.pendingFRU$ = this.brandsFlatRateUnitFacade.pending$;
    this.brandsFRU$ = this.brandsFlatRateUnitFacade.brandsFlatRateUnit$;
    this.remainingBrands$ = this.brandsFlatRateUnitFacade.remainingBrands$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Vehicle.LIST_VEHICLE_REFERENCE,
      permissionTags.Vehicle.CREATE_VEHICLE_REFERENCE,
      permissionTags.Vehicle.ACTIVATE_VEHICLE_REFERENCE,
      permissionTags.Vehicle.DEACTIVATE_VEHICLE_REFERENCE,
      permissionTags.Vehicle.GET_VEHICLE_REFERENCE,
      permissionTags.Vehicle.GET_BRAND_FRU,
      permissionTags.Vehicle.SET_BRAND_FRU
    ]);
  }

  openDialog(event: IVehicleReference.IDocument) {
    const dialogRef = this.dialog.open(
      VehicleReferenceConfirmationDialogComponent,
      {
        data: event,
        disableClose: true
      }
    );

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        return this.vehicleReferenceFacade.toggleStatus(event);
      } else {
        return this.vehicleReferenceFacade.resetToggle(event);
      }
    });
  }

  changePage(event: PageEvent) {
    const params: IVehicleReference.IConfig = {
      limit: IVehicleReference.Config.LIMIT,
      page: event.pageIndex + 1
    };
    this.vehicleReferenceFacade.changeVehicleReferencesPage(params);
  }

  onRefresh(event: boolean) {
    if (event) {
      const params: IVehicleReference.IConfig = {
        limit: IVehicleReference.Config.LIMIT,
        page: 1
      };
      this.vehicleReferenceFacade.setVehicleReferencesPage(params);
    }
  }
}
