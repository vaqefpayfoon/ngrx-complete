import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { ISort, IBC, IFilter } from '@neural/shared/data';

// Models
import { IAccount, IGroup } from '../../models';

// facade
import { AccountsFacade, CustomerAccountsFacade } from '../../+state/facades';

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
  selector: 'neural-customer-accounts',
  templateUrl: './customer-accounts.component.html',
  styleUrls: ['./customer-accounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerAccountsComponent implements OnInit {
  @Output() selected = new EventEmitter();
  @Output() selectedAccount: IAccount.IDocument | null;

  bc: IBC[];
  sort: ISort[];

  accounts$: Observable<IAccount.IDocument[]>;
  groups$: Observable<IGroup.IDocument[]>;
  total$: Observable<number>;
  accountsConfig$: Observable<IAccount.IConfig>;
  customerFilter$: Observable<IAccount.IFilter>;
  searchedAccount$: Observable<IAccount.IDocument>;

  codes$: Observable<Auth.IPhoneCode[]>;

  permissions$: Observable<{}>;

  loading$: Observable<any>;
  error$: Observable<any>;

  sorts: any[] = [];

  pageEvent: PageEvent;

  constructor(
    private customerAccountsFacade: CustomerAccountsFacade,
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
        name: 'customer',
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

    this.accounts$ = this.customerAccountsFacade.accounts$;
    this.total$ = this.customerAccountsFacade.total$;
    this.accountsConfig$ = this.customerAccountsFacade.accountsConfig$;
    this.groups$ = this.customerAccountsFacade.groups$;
    this.customerFilter$ = this.customerAccountsFacade.filter$;
    this.loading$ = this.customerAccountsFacade.loading$;
    this.error$ = this.customerAccountsFacade.error$;

    this.codes$ = this.authFacade.codes$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Account.LIST_CUSTOMER_ACCOUNT,
      permissionTags.Account.ACTIVATE_ACCOUNT,
      permissionTags.Account.DEACTIVATE_ACCOUNT,
      permissionTags.Account.CREATE_ACCOUNT,
      permissionTags.Account.GET_ACCOUNT,
      permissionTags.Account.PURGE_ACCOUNT,
      permissionTags.Account.RESYNC_ACCOUNT
    ]);
  }

  onRefresh(event: boolean) {
    if (event) {
      const params: IAccount.IConfig = {
        limit: IAccount.Config.LIMIT,
        page: 1
      };
      this.customerAccountsFacade.changeAccountsPage(params);
    }
  }

  bySort(sort: ISort) {
    this.customerAccountsFacade.onSort(sort);
  }

  onFilter(filters: IFilter) {
    this.customerAccountsFacade.onFilter(filters);
  }

  openDialog(event: IAccount.IDocument) {
    const dialogRef = this.dialog.open(AccountConfirmationDialogComponent, {
      data: event,
      disableClose: true
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        return this.customerAccountsFacade.toggleStatus(event);
      } else {
        return this.customerAccountsFacade.resetToggle(event);
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
        return this.customerAccountsFacade.deleteAccount(event);
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
        return this.customerAccountsFacade.resyncAccount(event);
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
    this.customerAccountsFacade.changeAccountsPage(params);
  }

  onSubmit(value: IAccount.IFilter) {
    if (value) {
      this.customerAccountsFacade.onSearch(value);
    }
  }
}
