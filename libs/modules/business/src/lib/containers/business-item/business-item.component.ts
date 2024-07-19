import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';

// BreadCrumb Interface
import {  IBC } from '@neural/shared/data';

// Models
import { IBusinesses } from '../../models';

// facade
import { BusinessesFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

@Component({
  selector: 'neural-business-item',
  templateUrl: './business-item.component.html',
  styleUrls: ['./business-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessItemComponent implements OnInit, OnDestroy {

  bc: IBC[];

  business$: Observable<IBusinesses.IDocument>;

  permissions$: Observable<{}>;

  constructor(
    private businessesFacade: BusinessesFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.businessesFacade.onResetSelectedBusiness();
  }

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null,
      },
      {
        name: 'businesses',
        path: '/app/customer/businesses',
      },
      {
        name: 'create',
        path: null
      }
    ];

    this.business$ = this.businessesFacade.business$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Business.CREATE_BUSINESS,
      permissionTags.Business.UPDATE_BUSINESS
    ]);
  }

  onCreate(business: IBusinesses.ICreate) {
    this.businessesFacade.create(business);
  }

  onUpdate(business: IBusinesses.IDocument) {
    this.businessesFacade.update(business);
  }

  onload(business: IBusinesses.IDocument) {
    if (business) {
      this.bc[this.bc.length - 1].name = business.name;
    }
  }
}
