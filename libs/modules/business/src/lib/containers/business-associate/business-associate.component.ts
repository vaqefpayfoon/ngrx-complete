import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy
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
import { IAccount } from '@neural/modules/administration';

@Component({
  selector: 'neural-business-associate',
  templateUrl: './business-associate.component.html',
  styleUrls: ['./business-associate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessAssociateComponent implements OnInit, OnDestroy {
  bc: IBC[];

  business$: Observable<IBusinesses.IDocument>;
  
  pagination$: Observable<IBusinesses.IPagination>;
  
  accounts$: Observable<IAccount.IDocument[]>;

  permissions$: Observable<{}>;
  
  loadingAccounts$: Observable<boolean>;

  constructor(
    private businessesFacade: BusinessesFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null
      },
      {
        name: 'businesses',
        path: '/app/customer/businesses'
      },
      {
        name: 'associate',
        path: null
      },
      {
        name: 'associate',
        path: null
      }
    ];

    this.business$ = this.businessesFacade.business$;
    this.accounts$ = this.businessesFacade.accounts$;

    this.pagination$ = this.businessesFacade.accountsConfig$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Business.ASSOCIATE_ACCOUNTS_BUSINESS
    ]);

    this.loadingAccounts$ = this.businessesFacade.loadingAccounts$;
  }

  ngOnDestroy() {
    this.businessesFacade.reset();
  }

  onSearch(config: IBusinesses.ISearch[]) {
    this.businessesFacade.search(config);
  }

  onAssociate(business: IBusinesses.IAssociate) {
    this.businessesFacade.associate(business);
  }

  onload(business: IBusinesses.IDocument) {
    if (business) {
      this.bc[this.bc.length - 2].name = business.name;
      this.bc[this.bc.length - 2].path = `/app/customer/businesses/${
        business.uuid
      }`;
    }
  }

  onChanged(page: IBusinesses.IConfig) {
    this.businessesFacade.changePage(page);
  }
}
