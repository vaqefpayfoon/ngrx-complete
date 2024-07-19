import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { ISort, IBC } from '@neural/shared/data';

// Models
import { IFleet } from '../../models';

// facade
import { FleetFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

// Dialog
import { FleetConfirmationDialogComponent } from '../../components';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

// Auth
import { Auth, AuthFacade } from '@neural/auth';

@Component({
  selector: 'neural-fleets',
  templateUrl: './fleets.component.html',
  styleUrls: ['./fleets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FleetsComponent implements OnInit {
  bc: IBC[];
  sort: ISort[];

  search = false;
  filter: any;

  fleets$: Observable<IFleet.IDocument[]>;
  total$: Observable<number>;
  fleetsConfig$: Observable<IFleet.IConfig>;

  selectedBranch$: Observable<Auth.IBranch>;

  loading$: Observable<any>;
  error$: Observable<any>;

  permissions$: Observable<{}>;

  constructor(
    private fleetFacade: FleetFacade,
    private authFacade: AuthFacade,
    private dialog: MatDialog,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null
      },
      {
        name: 'fleets',
        path: null
      }
    ];

    this.fleets$ = this.fleetFacade.fleets$;
    this.fleetsConfig$ = this.fleetFacade.fleetsConfig$;
    this.total$ = this.fleetFacade.total$;

    this.loading$ = this.fleetFacade.loading$;
    this.error$ = this.fleetFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Fleet.LIST_FLEET,
      permissionTags.Fleet.CREATE_FLEET,
      permissionTags.Fleet.ACTIVATE_FLEET,
      permissionTags.Fleet.DEACTIVATE_FLEET,
      permissionTags.Fleet.GET_FLEET
    ]);

    this.selectedBranch$ = this.authFacade.selectedBranch;
  }

  openDialog(event: IFleet.IDocument) {
    const dialogRef = this.dialog.open(FleetConfirmationDialogComponent, {
      data: event,
      disableClose: true
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        return this.fleetFacade.toggleStatus(event);
      } else {
        return this.fleetFacade.resetToggle(event);
      }
    });
  }

  onRefresh(event: boolean) {
    if (event) {
      this.fleetFacade.onLoad();
    }
  }

  onSubmit(value: any) {
    if (value) {
      this.search = true;
      this.filter = value.email;
    } else {
      this.search = false;
      this.filter = '';
    }
  }

  changePage(branchUuid: string, event: PageEvent) {
    const params: IFleet.IConfig = {
      limit: IFleet.Config.LIMIT,
      page: event.pageIndex + 1
    };
    this.fleetFacade.setFleetPage(branchUuid, params);
  }
}
