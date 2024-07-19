import { Component, OnInit } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IPurchases, ISales } from '../../models';

// facade
import { PurchasesFacade } from '../../+state/facades';

// RxJs
import { Observable, of } from 'rxjs';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

//Auth
import { AuthFacade } from '@neural/auth';

// Dialog
import {
  CancelConfirmationDialogComponent,
  CompleteConfirmationDialogComponent,
  PasswordExpiredDialogComponent,
} from '../../components';

// MatDialog
import { MatDialog } from '@angular/material/dialog';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'neural-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss'],
})
export class PurchasesComponent implements OnInit {
  bc: IBC[];

  purchases$: Observable<IPurchases.IDocument[]>;
  total$: Observable<number>;

  purchasesConfig$: Observable<ISales.IConfig>;

  purchasesFilter$: Observable<ISales.IFilter>;

  downloadedReportUrl$: Observable<string>;

  permissions$: Observable<{}>;

  passwordValidity: any;

  selectedCorporate$: Observable<{}>;
  selectedBranch$: Observable<{}>;

  loading$: Observable<boolean>;
  error$: Observable<any>;

  pageEvent: PageEvent;

  constructor(
    private purchasesFacade: PurchasesFacade,
    private dialog: MatDialog,
    private permissionValidatorService: PermissionValidatorService,
    private snackBar: MatSnackBar,
    private authFacade: AuthFacade
  ) {}

  ngOnInit(): void {
    this.initialData();
  }

  initialData(): void {
    this.bc = [
      {
        name: 'hub',
        path: null,
      },
      {
        name: 'sales',
        path: null,
      },
      {
        name: 'purchases',
        path: null,
      },
    ];

    this.purchases$ = this.purchasesFacade.purchases$;
    this.total$ = this.purchasesFacade.total$;

    this.purchasesConfig$ = this.purchasesFacade.purchasesConfig$;
    this.purchasesFilter$ = this.purchasesFacade.getPurchasesFilters$;

    this.loading$ = this.purchasesFacade.loading$;
    this.error$ = this.purchasesFacade.error$;

    this.selectedCorporate$ = this.authFacade.selectedCorporate;
    this.selectedBranch$ = this.authFacade.selectedBranch;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Sale.LIST_SALES,
      permissionTags.Sale.UPDATE_SALE,
      permissionTags.Sale.CANCEL_SALE,
      permissionTags.Sale.COMPLETE_SALE,
      permissionTags.Sale.GET_SALE,
      permissionTags.Analytic.SALE_DOWNLOAD_REPORT,
    ]);

    this.authFacade.account$.subscribe(
      (data) => (this.passwordValidity = new Date(data?.password?.expiry))
    );

    this.openPasswordExpiredDialog();
  }

  cancel(purchase: IPurchases.IDocument) {
    const dialogRef = this.dialog.open(CancelConfirmationDialogComponent, {
      data: purchase,
      disableClose: true,
    });

    dialogRef.componentInstance.status.subscribe(
      (payload: IPurchases.IRemark) => {
        if (!!payload) {
          this.purchasesFacade.onCancel({ ...purchase, ...payload });
        }
      }
    );
  }

  complete(purchase: IPurchases.IDocument) {
    const dialogRef = this.dialog.open(CompleteConfirmationDialogComponent, {
      data: purchase,
      disableClose: true,
    });

    dialogRef.componentInstance.status.subscribe(
      (payload: IPurchases.IRemark) => {
        if (!!payload) {
          this.purchasesFacade.onComplete({ ...purchase, ...payload });
        }
      }
    );
  }

  onRefresh(event: boolean) {
    if (event) {
      this.purchasesFacade.resetPurchasesPage();
    }
  }

  changePage(event: PageEvent) {
    const params: ISales.IConfig = {
      limit: ISales.Config.LIMIT,
      page: event.pageIndex + 1,
    };
    this.purchasesFacade.changePurchasesPage(params);
  }

  onFilter(event: ISales.ISearch) {
    if (event) {
      this.purchasesFacade.changePurchasesFilter(event);
    }
  }

  onDownload(event: IPurchases.IDownloadReport) {
    if (event) {
      this.downloadedReportUrl$ = this.purchasesFacade.onDownload(event).pipe(
        catchError((res: any) => {
          this.toggleSnackbar(res.error.response.message);
          return of(null);
        })
      );
    }
  }

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }

  openPasswordExpiredDialog() {
    const expiryDays = this.permissionValidatorService.calculateExpiryDays(
      this.passwordValidity
    );

    if (expiryDays < 1) {
      const dialogRef = this.dialog.open(PasswordExpiredDialogComponent, {
        disableClose: true,
        width: '480px',
        height: '200px',
      });

      dialogRef.componentInstance.redirect.subscribe((x) => {
        if (x) {
          this.authFacade.onRedirectToProfile();
        }
      });

      dialogRef.componentInstance.logout.subscribe((x) => {
        if (x) {
          this.authFacade.onLogout();
        }
      });
    }
  }
}
