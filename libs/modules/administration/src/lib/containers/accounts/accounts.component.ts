import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { ISort, IBC, IFilter } from '@neural/shared/data';

// Models
import { IAccount, IGroup } from '../../models';

// facade
import { AccountsFacade } from '../../+state/facades';
import { PermissionValidatorService, AuthFacade } from '@neural/auth';

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
  selector: 'neural-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsComponent implements OnInit {
  bc: IBC[];
  sort: ISort[];

  search = false;

  accounts$: Observable<IAccount.IDocument[]>;
  groups$: Observable<IGroup.IDocument[]>;
  total$: Observable<number>;
  accountsConfig$: Observable<IAccount.IConfig>;
  accountFilter$: Observable<IAccount.IFilter>;
  permissions$: Observable<{}>;

  loading$: Observable<any>;
  error$: Observable<unknown>;
  
  isSuperAdmin$: Observable<boolean>;

  pageEvent: PageEvent;

  constructor(
    private accountsFacade: AccountsFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService,
    private dialog: MatDialog
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

    this.accounts$ = this.accountsFacade.accounts$;
    this.total$ = this.accountsFacade.total$;
    this.accountsConfig$ = this.accountsFacade.accountsConfig$;
    this.groups$ = this.accountsFacade.groups$;
    this.accountFilter$ = this.accountsFacade.filter$;
    this.loading$ = this.accountsFacade.loading$;
    this.error$ = this.accountsFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Account.LIST_ADMIN_ACCOUNT,
      permissionTags.Account.ACTIVATE_ACCOUNT,
      permissionTags.Account.DEACTIVATE_ACCOUNT,
      permissionTags.Account.GET_ACCOUNT_BY_EMAIL,
      permissionTags.Account.CREATE_ACCOUNT,
      permissionTags.Account.GET_ACCOUNT,
      permissionTags.Account.PURGE_ACCOUNT,
      permissionTags.Account.RESYNC_ACCOUNT,
      permissionTags.Account.RESYNC_AUTH_ACCOUNT
    ]);

    this.isSuperAdmin$ = this.authFacade.isSuperAdmin$;
  }

  onRefresh(event: boolean) {
    if (event) {
      const params: IAccount.IConfig = {
        limit: IAccount.Config.LIMIT,
        page: 1
      };
      this.accountsFacade.resetSortAccount();
      this.accountsFacade.changeAccountsPage(params);
    }
  }

  bySort(sort: ISort) {
    this.accountsFacade.onSort(sort);
  }

  openDialog(event: IAccount.IDocument) {
    const dialogRef = this.dialog.open(AccountConfirmationDialogComponent, {
      data: event,
      disableClose: true
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        return this.accountsFacade.toggleStatus(event);
      } else {
        return this.accountsFacade.resetToggle(event);
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
        return this.accountsFacade.deleteAccount(event);
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
        return this.accountsFacade.resyncAccount(event);
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

  changePage(event: PageEvent) {
    const params: IAccount.IConfig = {
      limit: IAccount.Config.LIMIT,
      page: event.pageIndex + 1
    };
    this.accountsFacade.changeAccountsPage(params);
  }

  onSubmit(value: IAccount.IFilter) {
    if (value) {
      this.search = true;
      this.accountsFacade.onSearch(value);
    } else {
      this.search = false;
      this.accountsFacade.resetFilterAccount();
    }
  }

  openQrDialog(event: IAccount.IDocument) {
    this.dialog.open(AccountQrcodeDialogComponent, {
      data: event,
      disableClose: true
    });
  }
  onFilter(filters: IFilter) {
    this.accountsFacade.onSearch(filters);
  }
}
