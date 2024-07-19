import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import {  ISort, IBC } from '@neural/shared/data';

// Models
import { IProductCoverages } from '../../models';

// facade
import { ProductCoveragesFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

// Dialog
import { ProductCoverageConfirmationDialogComponent } from '../../components';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// Services
import { ServicesFacade, IServices } from '@neural/modules/customer/services';

// Auth
import { Auth, PermissionValidatorService } from '@neural/auth';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-product-coverages',
  templateUrl: './product-coverages.component.html',
  styleUrls: ['./product-coverages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCoveragesComponent implements OnInit {
  bc: IBC[];
  sort: ISort[];

  search = false;
  filter: any;

  products$: Observable<IProductCoverages.IDocument[]>;
  total$: Observable<number>;
  productsConfig$: Observable<IProductCoverages.IConfig>;

  services$: Observable<IServices.IDocument[]>;

  branch$: Observable<Auth.IBranch>;

  loading$: Observable<any>;
  error$: Observable<any>;
  permissions$: Observable<{}>;

  constructor(
    private productCoveragesFacade: ProductCoveragesFacade,
    private permissionValidatorService: PermissionValidatorService,
    private servicesFacade: ServicesFacade,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null
      },
      {
        name: 'inventory',
        path: null
      }
    ];

    this.products$ = this.productCoveragesFacade.productCoverages$;
    this.productsConfig$ = this.productCoveragesFacade.productCoveragesConfig$;
    this.total$ = this.productCoveragesFacade.total$;

    this.loading$ = this.productCoveragesFacade.loading$;
    this.error$ = this.productCoveragesFacade.error$;

    this.services$ = this.servicesFacade.filteredService$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Product.LIST_PRODUCT_COVERAGE,
      permissionTags.Product.CREATE_PRODUCT_COVERAGE,
      permissionTags.Product.ACTIVATE_PRODUCT_COVERAGE,
      permissionTags.Product.DEACTIVATE_PRODUCT_COVERAGE,
      permissionTags.Product.GET_PRODUCT_COVERAGE,
      permissionTags.Product.DELETE_PRODUCT_COVERAGE
    ]);
  }

  openDialog(event: IProductCoverages.IDocument) {
    const dialogRef = this.dialog.open(
      ProductCoverageConfirmationDialogComponent,
      {
        data: event,
        disableClose: true
      }
    );
    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        return this.productCoveragesFacade.toggleStatus(event);
      } else {
        return this.productCoveragesFacade.resetToggle(event);
      }
    });
  }

  onRefresh(event: boolean) {
    if (event) {
      this.productCoveragesFacade.onLoad();
      this.servicesFacade.onLoad();
    }
  }

  onSubmit(value: any) {
    if (value) {
      this.search = true;
      this.filter = value.email;
    } else {
      this.search = false;
      this.filter = '';
    }
  }

  changePage(event: PageEvent) {
    const params: IProductCoverages.IConfig = {
      limit: IProductCoverages.Config.LIMIT,
      page: event.pageIndex + 1
    };
    this.productCoveragesFacade.setProductsPage(params);
  }

  onDelete(product: IProductCoverages.IDocument) {
    this.productCoveragesFacade.delete(product);
  }
}
