import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import {  ISort, IBC } from '@neural/shared/data';

// Models
import { IVehicle } from '../../models';

// RxJs
import { Observable } from 'rxjs';

// facade
import { VehiclesFacade } from '../../+state/facades';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

// Dialog
import { VehicleConfirmationDialogComponent } from '../../components';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService  } from '@neural/auth';

@Component({
  selector: 'neural-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehiclesComponent implements OnInit {
  vehicles$: Observable<IVehicle.IDocument[]>;

  total$: Observable<number>;
  vehiclesConfig$: Observable<IVehicle.IConfig>;
  type$: Observable<string>;

  loading$: Observable<any>;
  error$: Observable<any>;

  permissions$: Observable<{}>;

  bc: IBC[];
  sort: ISort[];

  search = false;

  pageEvent: PageEvent;

  constructor(
    private vehiclesFacade: VehiclesFacade,
    private permissionValidatorService: PermissionValidatorService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'customer',
        path: null,
      },
      {
        name: 'vehicle',
        path: null,
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

    this.loading$ = this.vehiclesFacade.loading$;
    this.error$ = this.vehiclesFacade.error$;
    this.vehicles$ = this.vehiclesFacade.vehicles$;
    this.type$ = this.vehiclesFacade.type$;

    this.total$ = this.vehiclesFacade.total$;
    this.vehiclesConfig$ = this.vehiclesFacade.vehiclesConfig$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Vehicle.LIST_VEHICLE,
      permissionTags.Vehicle.CREATE_VEHICLE,
      permissionTags.Vehicle.ACTIVATE_VEHICLE,
      permissionTags.Vehicle.DEACTIVATE_VEHICLE,
      permissionTags.Vehicle.GET_VEHICLE
    ]);
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
        return this.vehiclesFacade.resetToggle(event);
      }
    });
  }

  changePage(event: PageEvent) {
    const params: IVehicle.IConfig = {
      limit: IVehicle.Config.LIMIT,
      page: event.pageIndex + 1
    };
    this.vehiclesFacade.changeVehiclesPage(params);
  }

  bySort(sort: ISort) {
    this.vehiclesFacade.onSort(sort);
  }

  onRefresh(event: boolean) {
    if (event) {
      const params: IVehicle.IConfig = {
        limit: IVehicle.Config.LIMIT,
        page: 1
      };
      this.vehiclesFacade.setVehiclesPage(params);
    }
  }

  onSubmit(value: IVehicle.IFilter) {
    if (value) {
      this.search = true;
      this.vehiclesFacade.onSearch(value);
    } else {
      this.search = false;
      this.vehiclesFacade.resetFilterVehicles();
    }
  }
}
