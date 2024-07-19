import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IServices } from '../../models';

// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// Facades
import { ServicesFacade } from '../../+state/facade';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-service-item',
  templateUrl: './service-item.component.html',
  styleUrls: ['./service-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceItemComponent implements OnInit, OnDestroy {
  bc: IBC[];

  service$: Observable<IServices.IDocument>;

  selectedBranch$: Observable<Auth.IBranch>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  error$: Observable<any>;

  loading$: Observable<any>;

  permissions$: Observable<{}>;

  constructor(
    private servicesFacade: ServicesFacade,
    private permissionValidatorService: PermissionValidatorService,
    private authFacade: AuthFacade
  ) {}

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.servicesFacade.onResetSelectedService();
  }

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: 'null'
      },
      {
        name: 'services',
        path: '/app/hub/services/list'
      },
      {
        name: 'create',
        path: null
      }
    ];

    this.service$ = this.servicesFacade.service$;

    this.error$ = this.servicesFacade.error$;

    this.loading$ = this.servicesFacade.loading$;

    this.selectedBranch$ = this.authFacade.selectedBranch;

    this.selectedCorporate$ = this.authFacade.selectedCorporate;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Service.CREATE_SERVICE,
      permissionTags.Service.UPDATE_SERVICE
    ]);
  }

  onCreate(service: IServices.ICreate) {
    this.servicesFacade.create(service);
  }

  onUpdate(service: IServices.IDocument) {
    this.servicesFacade.update(service);
  }

  onLoad(service: IServices.IDocument) {
    if (service) {
      this.bc[this.bc.length - 1].name = service.title;
    }
  }

  onBranchChange(event: boolean) {
    if (event) {
      this.servicesFacade.branchChange();
    }
  }
}
