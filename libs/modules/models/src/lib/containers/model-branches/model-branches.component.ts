import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Models
import { IModels } from '../../models';

// facade
import { CarModelsFacade } from '../../+state/facades';
// Auth
import { Auth, AuthFacade } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

@Component({
  selector: 'neural-model-branches',
  templateUrl: './model-branches.component.html',
  styleUrls: ['./model-branches.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelBranchesComponent implements OnInit {
  permissions$: Observable<{}>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  unit$: Observable<IModels.IUnitList>;

  error$: Observable<any>;

  bc: IBC[];

  constructor(
    private carModelsFacade: CarModelsFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null
      },
      {
        name: 'car models',
        path: '/app/models'
      },
      {
        name: 'branches config',
        path: null
      }
    ];

    this.unit$ = this.carModelsFacade.unit$;

    this.error$ = this.carModelsFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Model.CREATE_MODEL,
      permissionTags.Model.UPDATE_MODEL
    ]);

    this.selectedCorporate$ = this.authFacade.selectedCorporate;
  }

  ngOnInit() {
    this.initialData();
  }

  onChangeSeries(event: { brand: string; series: string }) {
    this.carModelsFacade.onListSeriesModels(event);
  }

  onSetBranch(payload: IModels.ISetBranches) {
    this.carModelsFacade.onSetBranch(payload);
  }
}
