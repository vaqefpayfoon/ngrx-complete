import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { ISort, IBC } from '@neural/shared/data';

// Models
import { IAccount, IGroup } from '../../models';

// facade
import { AccountsFacade, OperationAccountsFacade } from '../../+state/facades';

// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

// Dialog
import {
  AccountConfirmationDialogComponent,
  AccountQrcodeDialogComponent,
  AccountConfirmationDeleteDialogComponent,
  AccountConfirmationResyncDialogComponent,
  FirebaseConfirmationResyncDialogComponent
} from '../../components';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-operation-accounts',
  templateUrl: './operation-accounts.component.html',
  styleUrls: ['./operation-accounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperationAccountsComponent implements OnInit {
  bc: IBC[];
  sort: ISort[];

  search = false;

  accounts$: Observable<IAccount.IDocument[]>;
  groups$: Observable<IGroup.IDocument[]>;
  total$: Observable<number>;
  accountsConfig$: Observable<IAccount.IConfig>;

  searchedAccount$: Observable<IAccount.IDocument>;

  codes$: Observable<Auth.IPhoneCode[]>;

  permissions$: Observable<{}>;

  loading$: Observable<any>;
  error$: Observable<any>;

  sorts: any[] = [];

  pageEvent: PageEvent;

  constructor(
    private operationAccountsFacade: OperationAccountsFacade,
    private authFacade: AuthFacade,
    private accountsFacade: AccountsFacade,
    private permissionValidatorService: PermissionValidatorService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'operation',
        path: null
      },
      {
        name: 'accounts',
        path: null
      }
    ];

    this.sort = [
      {
        Name: 1
      },
      {
        Email: 1
      },
      {
        Phone: 1
      }
    ];

    this.accounts$ = this.operationAccountsFacade.accounts$;
    this.total$ = this.operationAccountsFacade.total$;
    this.accountsConfig$ = this.operationAccountsFacade.accountsConfig$;
    this.groups$ = this.operationAccountsFacade.groups$;

    this.loading$ = this.operationAccountsFacade.loading$;
    this.error$ = this.operationAccountsFacade.error$;

    this.codes$ = this.authFacade.codes$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Account.LIST_OPERATION_ACCOUNT,
      permissionTags.Account.ACTIVATE_ACCOUNT,
      permissionTags.Account.DEACTIVATE_ACCOUNT,
      permissionTags.Account.CREATE_ACCOUNT,
      permissionTags.Account.GET_ACCOUNT,
      permissionTags.Account.RESYNC_ACCOUNT,
      permissionTags.Account.PURGE_ACCOUNT
    ]);
  }

  onRefresh(event: boolean) {
    if (event) {
      const params: IAccount.IConfig = {
        limit: IAccount.Config.LIMIT,
        page: 1
      };
      this.operationAccountsFacade.changeAccountsPage(params);
    }
  }

  bySort(sort: ISort) {
    this.operationAccountsFacade.onSort(sort);
  }

  openDialog(event: IAccount.IDocument) {
    const dialogRef = this.dialog.open(AccountConfirmationDialogComponent, {
      data: event,
      disableClose: true
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        return this.operationAccountsFacade.toggleStatus(event);
      } else {
        return this.operationAccountsFacade.resetToggle(event);
      }
    });
  }

  openDeleteDialog(event: IAccount.IDocument) {
    const dialogRef = this.dialog.open(
      AccountConfirmationDeleteDialogComponent,
      {
        data: event,
        disableClose: true
      }
    );

    dialogRef.componentInstance.deleted.subscribe((res: boolean) => {
      if (res) {
        return this.operationAccountsFacade.deleteAccount(event);
      }
    });
  }

  openReSyncDialog(event: IAccount.IDocument) {
    const dialogRef = this.dialog.open(
      AccountConfirmationResyncDialogComponent,
      {
        data: event,
        disableClose: true
      }
    );

    dialogRef.componentInstance.resynced.subscribe((res: boolean) => {
      if (res) {
        return this.operationAccountsFacade.resyncAccount(event);
      }
    });
  }

  openFirebaseReSyncDialog(event: IAccount.IDocument) {
    const dialogRef = this.dialog.open(
      FirebaseConfirmationResyncDialogComponent,
      {
        data: event,
        disableClose: true
      }
    );

    dialogRef.componentInstance.firebaseResynced.subscribe((res: boolean) => {
      if (res) {
        return this.accountsFacade.resyncFirebase(event);
      }
    });
  }

  openQrDialog(event: IAccount.IDocument) {
    this.dialog.open(AccountQrcodeDialogComponent, {
      data: event,
      disableClose: true
    });
  }

  changePage(event: PageEvent) {
    const params: IAccount.IConfig = {
      limit: IAccount.Config.LIMIT,
      page: event.pageIndex + 1
    };
    this.operationAccountsFacade.changeAccountsPage(params);
  }

  onSubmit(value: IAccount.IFilter) {
    if (value) {
      this.search = true;
      this.operationAccountsFacade.onSearch(value);
    } else {
      this.search = false;
      this.operationAccountsFacade.resetFilterAccount();
    }
  }
}
