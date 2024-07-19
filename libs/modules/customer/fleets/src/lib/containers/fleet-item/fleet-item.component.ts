import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import {  IBC } from '@neural/shared/data';

// Models
import { IFleet } from '../../models';

// Facades
import { FleetFacade } from '../../+state/facades';
import { AuthFacade, Auth, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-fleet-item',
  templateUrl: './fleet-item.component.html',
  styleUrls: ['./fleet-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FleetItemComponent implements OnInit, OnDestroy {
  bc: IBC[];

  fleet$: Observable<IFleet.IDocument>;
  branch$: Observable<Auth.IBranch>;

  permissions$: Observable<{}>;

  constructor(
    private fleetFacade: FleetFacade,
    private permissionValidatorService: PermissionValidatorService,
    private authFacade: AuthFacade
  ) {}

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.fleetFacade.onResetSelectedFleet();
  }

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null,
      },
      {
        name: 'fleets',
        path: '/app/hub/fleets',
      },
      {
        name: 'create',
        path: null
      }
    ];

    this.fleet$ = this.fleetFacade.fleet$;
    this.branch$ = this.authFacade.selectedBranch;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Fleet.CREATE_FLEET,
      permissionTags.Fleet.UPDATE_FLEET
    ]);
  }

  onCreate(fleet: IFleet.ICreate) {
    this.fleetFacade.create(fleet);
  }

  onUpdate(fleet: IFleet.IDocument) {
    this.fleetFacade.update(fleet);
  }

  onload(fleet: IFleet.IDocument) {
    if (fleet) {
      this.bc[this.bc.length - 1].name = fleet.name;
    }
  }

  onBranchChange(event: boolean) {
    if (event) {
      this.fleetFacade.branchChange();
    }
  }
}
