import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Location
import { Location } from '@angular/common';

// Models
import { IAccount, IGroup } from '../../models';
import { ICorporates } from '@neural/modules/customer/corporate';

// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// facade
import { CustomerAccountsFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-customer-account-item',
  templateUrl: './customer-account-item.component.html',
  styleUrls: ['./customer-account-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerAccountItemComponent implements OnInit {
  title = 'create a new customer account';

  groups$: Observable<IGroup.IDocument[]>;

  data$: Observable<any>;

  account$: Observable<IAccount.IDocument>;

  corporates$: Observable<Auth.ICorporates[]>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  corporateInfo$: Observable<ICorporates.IDocument>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  codes$: Observable<Auth.IPhoneCode[]>;

  bc: IBC[];

  isCDK = false;

  constructor(
    private location: Location,
    private customerAccountsFacade: CustomerAccountsFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  close() {
    this.location.back();
  }

  initialData() {
    this.bc = [
      {
        name: 'customer',
        path: null,
      },
      {
        name: 'accounts',
        path: '/app/administration/customer',
      },
      {
        name: 'create',
        path: null,
      },
    ];

    this.groups$ = this.customerAccountsFacade.groups$;
    this.account$ = this.customerAccountsFacade.account$;
    this.error$ = this.customerAccountsFacade.error$;

    this.corporates$ = this.authFacade.corporates$;

    this.selectedCorporate$ = this.authFacade.selectedCorporate;

    this.corporateInfo$ = this.customerAccountsFacade.corporate$;
    this.corporateInfo$.subscribe((res: any) => {
      if (res?.configuration?.cdk?.active) {
        this.isCDK = true;
      } else {
        this.isCDK = false;
      }
    });
    this.codes$ = this.authFacade.codes$;

    this.data$ = this.customerAccountsFacade.router$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Account.CREATE_ACCOUNT,
      permissionTags.Account.UPDATE_ACCOUNT_PROFILE,
      permissionTags.Account.UPDATE_ACCOUNT_PASSWORD,
      permissionTags.Account.GET_ACCOUNT,
      permissionTags.Account.RESYNC_ACCOUNT,
      permissionTags.Account.PURGE_ACCOUNT,
    ]);
  }

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy(): void {
    this.customerAccountsFacade.onResetSelectedCustomerAccount();
  }

  onCreateAccount(account: IAccount.ICreate) {
    this.customerAccountsFacade.onCreate(account);
  }

  onUpdateAccount(account: IAccount.IDocument) {
    this.customerAccountsFacade.onUpdate(account);
  }

  onUpdateAccountPassword(account: IAccount.IUpdatePass) {
    this.customerAccountsFacade.onUpdatePassword(account);
  }

  onLoad(account: IAccount.IDocument) {
    if (account) {
      this.bc[this.bc.length - 1].name = account.identity.fullName;
      this.title = account.identity.fullName;
    }
  }

  onCorporateChange(event: boolean) {
    if (event) {
      this.customerAccountsFacade.onRedirect();
    }
  }
}
