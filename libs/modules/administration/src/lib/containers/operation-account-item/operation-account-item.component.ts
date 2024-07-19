import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Location
import { Location } from '@angular/common';

// Models
import { IAccount, IGroup } from '../../models';

// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// facade
import { BrandsFacade, OperationAccountsFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-operation-account-item',
  templateUrl: './operation-account-item.component.html',
  styleUrls: ['./operation-account-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperationAccountItemComponent implements OnInit, OnDestroy {
  title = 'create a new operation account';

  groups$: Observable<IGroup.IDocument[]>;

  data$: Observable<any>;

  account$: Observable<IAccount.IDocument>;

  corporates$: Observable<Auth.ICorporates[]>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  codes$: Observable<Auth.IPhoneCode[]>;

  brands$: Observable<string[]>;

  bc: IBC[];

  constructor(
    private location: Location,
    private operationAccountsFacade: OperationAccountsFacade,
    private authFacade: AuthFacade,
    private brandsFacade: BrandsFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  close() {
    this.location.back();
  }

  initialData() {
    this.bc = [
      {
        name: 'operation',
        path: null
      },
      {
        name: 'accounts',
        path: '/app/administration/operation'
      },
      {
        name: 'create',
        path: null
      }
    ];

    this.account$ = this.operationAccountsFacade.account$;
    this.error$ = this.operationAccountsFacade.error$;
    this.groups$ = this.operationAccountsFacade.groups$;

    this.corporates$ = this.authFacade.corporates$;

    this.selectedCorporate$ = this.authFacade.selectedCorporate;

    this.codes$ = this.authFacade.codes$;

    this.data$ = this.operationAccountsFacade.router$;

    this.brands$ = this.brandsFacade.globalBrands$;

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

  ngOnDestroy() {
    this.operationAccountsFacade.onResetSelectedOperationAccount();
  }

  onCreateAccount(account: IAccount.ICreate) {
    this.operationAccountsFacade.onCreate(account);
  }

  onUpdateAccount(account: IAccount.IDocument) {
    this.operationAccountsFacade.onUpdate(account);
  }

  onUpdateAccountPassword(account: IAccount.IUpdatePass) {
    this.operationAccountsFacade.onUpdatePassword(account);
  }

  onLoad(account: IAccount.IDocument) {
    if (account) {
      this.bc[this.bc.length - 1].name = `${account.identity.fullName}`;

      this.title = `${account.identity.fullName}`;
    }
  }

  onCorporateChange(event: boolean) {
    if (event) {
      this.operationAccountsFacade.onRedirect();
    }
  }
}
