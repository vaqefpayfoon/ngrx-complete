import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Location
import { Location } from '@angular/common';

// Models
import { IAccount, IGroup } from '../../models';

// facade
import {
  AccountsFacade,
  OperationAccountsFacade,
  CustomerAccountsFacade,
  BrandsFacade,
} from '../../+state/facades';
// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Dialog
import {
  AccountConfirmationDeleteDialogComponent,
  AccountConfirmationResyncDialogComponent,
} from '../../components';

// MatDialog
import { MatDialog } from '@angular/material/dialog';
import { ICorporates } from '@neural/modules/customer/corporate';

@Component({
  selector: 'neural-account-item',
  templateUrl: './account-item.component.html',
  styleUrls: ['./account-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountItemComponent implements OnInit, OnDestroy {
  title = 'create a new account';

  data$: Observable<any>;

  groups$: Observable<IGroup.IDocument[]>;

  account$: Observable<IAccount.IDocument>;

  searchedAccount$: Observable<IAccount.IDocument>;

  corporates$: Observable<Auth.ICorporates[]>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  codes$: Observable<Auth.IPhoneCode[]>;
  
  brands$: Observable<string[]>;

  bc: IBC[];

  bcSearch: IBC[];

  corporateInfo$: Observable<ICorporates.IDocument>;

  constructor(
    private location: Location,
    private accountsFacade: AccountsFacade,
    private brandsFacade: BrandsFacade,
    private operationAccountsFacade: OperationAccountsFacade,
    private customerAccountsFacade: CustomerAccountsFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService,
    private dialog: MatDialog
  ) {}

  close() {
    this.location.back();
  }

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null,
      },
      {
        name: 'accounts',
        path: '/app/administration/account',
      },
      {
        name: 'create',
        path: null,
      },
    ];

    this.bcSearch = [
      {
        name: 'administration',
        path: null,
      },
      {
        name: 'accounts',
        path: '/app/administration/account',
      },
      {
        name: 'search',
        path: null,
      },
    ];

    this.groups$ = this.accountsFacade.groups$;
    this.account$ = this.accountsFacade.account$;
    this.searchedAccount$ = this.accountsFacade.searchedAccount$;
    this.error$ = this.accountsFacade.error$;

    this.corporates$ = this.authFacade.corporates$;

    this.selectedCorporate$ = this.authFacade.selectedCorporate;

    this.codes$ = this.authFacade.codes$;

    this.data$ = this.accountsFacade.router$;

    this.brands$ = this.brandsFacade.globalBrands$;

    this.corporateInfo$ = this.customerAccountsFacade.corporate$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Account.CREATE_ACCOUNT,
      permissionTags.Account.UPDATE_ACCOUNT_PROFILE,
      permissionTags.Account.UPDATE_ACCOUNT_PASSWORD,
      permissionTags.Account.GET_ACCOUNT,
      permissionTags.Account.RESYNC_ACCOUNT,
      permissionTags.Account.PURGE_ACCOUNT,
    ]);
  }

  get accountType() {
    return IAccount.AccountType;
  }

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.accountsFacade.resetSearch();
    this.accountsFacade.onResetSelectedAccount();
  }

  onCreateAccount(account: IAccount.ICreate) {
    this.accountsFacade.onCreate(account);
  }

  onUpdateAccount(account: IAccount.IDocument) {
    this.accountsFacade.onUpdate(account);
  }

  onUpdateSearchAccount(account: IAccount.IDocument) {
    this.accountsFacade.onUpdate(account);
  }

  onUpdateAccountPassword(account: IAccount.IUpdatePass) {
    this.accountsFacade.onUpdatePassword(account);
  }

  onLoad(account: IAccount.IDocument) {
    if (account) {
      this.bc[this.bc.length - 1].name = account.identity.fullName;
      this.title = account.identity.fullName;
    }
  }

  onCorporateChange(event: boolean) {
    if (event) {
      this.accountsFacade.onRedirect();
    }
  }

  onSearch(email: string) {
    if (!!email) {
      this.accountsFacade.onSearchByEmail(email);
    }
  }

  openDeleteDialog(event: IAccount.IDocument) {
    const dialogRef = this.dialog.open(
      AccountConfirmationDeleteDialogComponent,
      {
        data: event,
        disableClose: true,
      }
    );

    if (event?.permissions?.adminGroupUuid) {
      return dialogRef.componentInstance.deleted.subscribe((res: boolean) => {
        if (res) {
          return this.accountsFacade.deleteAccount(event);
        }
      });
    }

    if (event?.permissions?.operationRole) {
      return dialogRef.componentInstance.deleted.subscribe((res: boolean) => {
        if (res) {
          return this.operationAccountsFacade.deleteAccount(event);
        }
      });
    }

    if (
      !event?.permissions
    ) {
      return dialogRef.componentInstance.deleted.subscribe((res: boolean) => {
        if (res) {
          return this.customerAccountsFacade.deleteAccount(event);
        }
      });
    }
  }

  openReSyncDialog(event: IAccount.IDocument) {
    const dialogRef = this.dialog.open(
      AccountConfirmationResyncDialogComponent,
      {
        data: event,
        disableClose: true,
      }
    );

    if (event?.permissions?.adminGroupUuid) {
      return dialogRef.componentInstance.resynced.subscribe((res: boolean) => {
        if (res) {
          return this.accountsFacade.resyncAccount(event);
        }
      });
    }

    if (event?.permissions?.operationRole) {
      return dialogRef.componentInstance.resynced.subscribe((res: boolean) => {
        if (res) {
          return this.operationAccountsFacade.resyncAccount(event);
        }
      });
    }

    if (
      !event?.permissions?.operationRole &&
      !event?.permissions?.adminGroupUuid
    ) {
      return dialogRef.componentInstance.resynced.subscribe((res: boolean) => {
        if (res) {
          return this.operationAccountsFacade.resyncAccount(event);
        }
      });
    }
  }
}
