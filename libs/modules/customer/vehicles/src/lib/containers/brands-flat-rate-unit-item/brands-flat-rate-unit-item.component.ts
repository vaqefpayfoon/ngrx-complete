import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// Models
import { IBrandsFlatRateUnit } from '../../models';

// RxJs
import { Observable } from 'rxjs';

// facade
import { BrandsFlatRateUnitFacade } from '../../+state/facades';

// Corporates
import { AuthFacade, Auth, PermissionValidatorService } from '@neural/auth';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-brands-flat-rate-unit-item',
  templateUrl: './brands-flat-rate-unit-item.component.html',
  styleUrls: ['./brands-flat-rate-unit-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandsFlatRateUnitItemComponent implements OnInit {
  brandsFlatRateUnit$: Observable<IBrandsFlatRateUnit.IDocument[]>;

  remainingBrands$: Observable<string[]>;

  loading$: Observable<boolean>;

  error$: Observable<any>;

  corporates$: Observable<Auth.ICorporates[]>;

  bc: IBC[];

  permissions$: Observable<{}>;

  constructor(
    private brandsFlatRateUnitFacade: BrandsFlatRateUnitFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'Administration',
        path: null,
      },
      {
        name: 'Configuration',
        path: null,
      },
      {
        name: 'Vehicle References',
        path: '/app/customer/vehicles/references',
      },
      {
        name: 'Flat Rate unit',
        path: null,
      },
    ];

    this.loading$ = this.brandsFlatRateUnitFacade.loading$;

    this.brandsFlatRateUnit$ = this.brandsFlatRateUnitFacade.brandsFlatRateUnit$;
    this.remainingBrands$ = this.brandsFlatRateUnitFacade.remainingBrands$;

    this.corporates$ = this.authFacade.corporates$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Vehicle.GET_BRAND_FRU,
      permissionTags.Vehicle.SET_BRAND_FRU,
    ]);

    this.error$ = this.brandsFlatRateUnitFacade.error$;
  }

  setBrandsFRU(event: IBrandsFlatRateUnit.ISetBrandsFru) {
    this.brandsFlatRateUnitFacade.onUpdate(event);
  }
}
