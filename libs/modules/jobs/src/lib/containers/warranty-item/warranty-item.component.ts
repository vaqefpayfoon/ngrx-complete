import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import {  IBC } from '@neural/shared/data';

// Models
import { IWarranties } from '../../models';

// Facades
import { WarrantiesFacade } from '../../+state/facade';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

@Component({
  selector: 'neural-warranty-item',
  templateUrl: './warranty-item.component.html',
  styleUrls: ['./warranty-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarrantyItemComponent implements OnInit, OnDestroy {
  warranty$: Observable<IWarranties.IDocument>;

  vehicle$: Observable<IWarranties.IDocumentVin>;

  error$: Observable<any>;

  loading$: Observable<any>;

  permissions$: Observable<{}>;

  selectedBranch$: Observable<Auth.IBranch>;

  bc: IBC[];

  constructor(
    private warrantiesFacade: WarrantiesFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.warrantiesFacade.onResetSelectedWarranty();
  }

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null
      },
      {
        name: 'reservations',
        path: null
      },
      {
        name: 'reminders',
        path: '/app/hub/reservations/reminders'
      },
      {
        name: 'create',
        path: null
      }
    ];
    this.warranty$ = this.warrantiesFacade.warranty$;

    this.error$ = this.warrantiesFacade.error$;

    this.loading$ = this.warrantiesFacade.loading$;

    this.vehicle$ = this.warrantiesFacade.vehicle$;

    this.warrantiesFacade.reset();

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.ServiceRecall.GET_SERVICE_RECALL,
      permissionTags.ServiceRecall.CREATE_SERVICE_RECALL,
      permissionTags.ServiceRecall.GET_VEHICLE_BY_VIN
    ]);

    this.selectedBranch$ = this.authFacade.selectedBranch;
  }

  vinSelected(vin: string) {
    const selected: IWarranties.IVin = {
      vin
    };
    this.warrantiesFacade.getVin(selected);
  }

  onCreate(payload: {
    warranty: IWarranties.ICreate;
    entity: IWarranties.IDocumentVin;
  }) {
    this.warrantiesFacade.create(payload);
  }

  onLoad(warranty: IWarranties.IDocument) {
    if (warranty) {
      this.bc[this.bc.length - 1].name = warranty.accountVehicle.numberPlate;
    }
  }

  onBranchChange(event: boolean) {
    if (event) {
      this.warrantiesFacade.branchChange();
    }
  }
}
