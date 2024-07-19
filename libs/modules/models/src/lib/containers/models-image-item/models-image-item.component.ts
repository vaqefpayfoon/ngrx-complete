import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Models
import { IModels } from '../../models';

// facade
import { CarModelsFacade } from '../../+state/facades';
// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-models-image-item',
  templateUrl: './models-image-item.component.html',
  styleUrls: ['./models-image-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelsImageItemComponent implements OnInit {
  permissions$: Observable<{}>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  unit$: Observable<IModels.IUnitList>;

  currentModelImageUrl$: Observable<{
    url: {
      [name: string]: string;
    };
    index: number;
  }>;

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
        path: null,
      },
      {
        name: 'car models',
        path: '/app/models',
      },
      {
        name: 'model images',
        path: null,
      },
    ];

    this.unit$ = this.carModelsFacade.unit$;

    this.error$ = this.carModelsFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Model.CREATE_MODEL,
      permissionTags.Model.UPDATE_MODEL,
    ]);

    this.selectedCorporate$ = this.authFacade.selectedCorporate;

    this.currentModelImageUrl$ = this.carModelsFacade.temp$;
  }

  ngOnInit() {
    this.initialData();
  }

  onChangeSeries(event: { brand: string; series: string }) {
    this.carModelsFacade.onListSeriesModels(event);
  }

  onChangeModel(event: IModels.IVariant) {
    this.carModelsFacade.onListVariants(event);
    this.carModelsFacade.onSelectModelImage({
      corporateUuid: event.corporateUuid,
      brand: event.brand,
      series: event.series,
      model: event.actualModel,
    });
  }

  onSetModelImage(payload: IModels.ISetModelImage) {
    this.carModelsFacade.onSetModelImage(payload);
  }
}
