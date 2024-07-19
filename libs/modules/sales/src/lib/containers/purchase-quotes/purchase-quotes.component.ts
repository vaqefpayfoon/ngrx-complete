import { Component, OnInit } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IPurchases, ISales } from '../../models';

// facade
import { PurchaseQuotesFacade } from '../../+state/facades';

// RxJs
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// permission tags
import { permissionTags } from '@neural/shared/data';

//Auth
import { AuthFacade, PermissionValidatorService } from '@neural/auth';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'neural-purchase-quotes',
  templateUrl: './purchase-quotes.component.html',
  styleUrls: ['./purchase-quotes.component.scss'],
})
export class PurchaseQuotesComponent implements OnInit {
  bc: IBC[];

  purchases$: Observable<IPurchases.IDocument[]>;
  total$: Observable<number>;

  purchasesConfig$: Observable<ISales.IConfig>;
  purchasesFilter$: Observable<ISales.IFilter>;

  downloadedReportUrl$: Observable<string>;

  permissions$: Observable<{}>;

  loading$: Observable<boolean>;
  error$: Observable<any>;

  selectedCorporate$: Observable<{}>;
  selectedBranch$: Observable<{}>;

  pageEvent: PageEvent;

  constructor(
    private purchaseQuotesFacade: PurchaseQuotesFacade,
    private permissionValidatorService: PermissionValidatorService,
    private snackBar: MatSnackBar,
    private authFacade: AuthFacade
  ) {}

  ngOnInit(): void {
    this.initialData();
  }

  initialData() {
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
        name: 'purchase quotes',
        path: null,
      },
    ];

    this.purchases$ = this.purchaseQuotesFacade.purchases$;
    this.total$ = this.purchaseQuotesFacade.total$;

    this.purchasesConfig$ = this.purchaseQuotesFacade.purchasesConfig$;
    this.purchasesFilter$ = this.purchaseQuotesFacade.getPurchasesFilters$;

    this.loading$ = this.purchaseQuotesFacade.loading$;
    this.error$ = this.purchaseQuotesFacade.error$;

    this.selectedCorporate$ = this.authFacade.selectedCorporate;
    this.selectedBranch$ = this.authFacade.selectedBranch;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Sale.LIST_PURCHASE_QUOTES,
      permissionTags.Sale.GET_PURCHASE_QUOTE,
      permissionTags.Analytic.PURCHASE_QUOTE_DOWNLOAD_REPORT,
    ]);
  }

  onRefresh(event: boolean) {
    if (event) {
      this.purchaseQuotesFacade.resetPurchaseQuotesPage();
    }
  }

  changePage(event: PageEvent) {
    const params: ISales.IConfig = {
      limit: ISales.Config.LIMIT,
      page: event.pageIndex + 1,
    };
    this.purchaseQuotesFacade.changePurchaseQuotesPage(params);
  }

  onFilter(event: ISales.ISearch) {
    if (event) {
      this.purchaseQuotesFacade.changePurchaseQuotesFilter(event);
    }
  }

  onDownload(event: IPurchases.IDownloadReport) {
    if (event) {
      this.downloadedReportUrl$ = this.purchaseQuotesFacade
        .onDownload(event)
        .pipe(
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
}
