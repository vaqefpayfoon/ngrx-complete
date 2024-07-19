import { Component, OnInit } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IPurchases, ISales } from '../../models';

// facade
import { ValuationsFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

// Dialog
import {
  CancelConfirmationDialogComponent,
  CompleteConfirmationDialogComponent,
} from '../../components';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'neural-valuations',
  templateUrl: './valuations.component.html',
  styleUrls: ['./valuations.component.scss'],
})
export class ValuationsComponent implements OnInit {
  bc: IBC[];

  valuations$: Observable<IPurchases.IDocument[]>;
  total$: Observable<number>;

  valuationsConfig$: Observable<ISales.IConfig>;

  permissions$: Observable<{}>;

  loading$: Observable<boolean>;
  error$: Observable<any>;

  pageEvent: PageEvent;

  constructor(
    private valuationsFacade: ValuationsFacade,
    private dialog: MatDialog,
    private permissionValidatorService: PermissionValidatorService
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
        name: 'valuations',
        path: null,
      },
    ];

    this.valuations$ = this.valuationsFacade.valuations$;
    this.total$ = this.valuationsFacade.total$;

    this.valuationsConfig$ = this.valuationsFacade.valuationsConfig$;

    this.loading$ = this.valuationsFacade.loading$;
    this.error$ = this.valuationsFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Sale.LIST_SALES,
      permissionTags.Sale.UPDATE_SALE,
    ]);
  }

  cancel(valuation: IPurchases.IDocument) {
    const dialogRef = this.dialog.open(CancelConfirmationDialogComponent, {
      data: valuation,
      disableClose: true,
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        this.valuationsFacade.onCancel(valuation);
      }
    });
  }

  complete(valuation: IPurchases.IDocument) {
    const dialogRef = this.dialog.open(CompleteConfirmationDialogComponent, {
      data: valuation,
      disableClose: true,
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        this.valuationsFacade.onComplete(valuation);
      }
    });
  }

  onRefresh(event: boolean) {
    if (event) {
      this.valuationsFacade.resetValuationsPage();
    }
  }

  changePage(event: PageEvent) {
    const params: ISales.IConfig = {
      limit: ISales.Config.LIMIT,
      page: event.pageIndex + 1,
    };
    this.valuationsFacade.changeValuationsPage(params);
  }
}
