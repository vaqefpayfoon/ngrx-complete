import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Location
import { Location } from '@angular/common';

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
  selector: 'neural-series-images',
  templateUrl: './series-images.component.html',
  styleUrls: ['./series-images.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeriesImagesComponent implements OnInit {
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
        name: 'series',
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

  onCreate(payload: IModels.ISetSeriesImage) {
    this.carModelsFacade.onSetSeriesImage(payload);
  }
}
