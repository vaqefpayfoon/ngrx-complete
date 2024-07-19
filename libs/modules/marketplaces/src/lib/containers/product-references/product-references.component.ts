import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import {  ISort, IBC } from '@neural/shared/data';

// Models
import { IProductReferences } from '../../models';

// facade
import { ProductReferencesFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

// Dialog
import { ProductConfirmationDialogComponent } from '../../components';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// Services
import { ServicesFacade, IServices } from '@neural/modules/customer/services';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService  } from '@neural/auth';

@Component({
  selector: 'neural-product-references',
  templateUrl: './product-references.component.html',
  styleUrls: ['./product-references.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductReferencesComponent implements OnInit {
  bc: IBC[];
  sort: ISort[];

  search = false;
  filter: any;

  products$: Observable<IProductReferences.IDocument[]>;
  total$: Observable<number>;
  productsConfig$: Observable<IProductReferences.IConfig>;
  
  loading$: Observable<any>;
  error$: Observable<any>;

  permissions$: Observable<{}>;

  constructor(
    private productReferencesFacade: ProductReferencesFacade,
    private servicesFacade: ServicesFacade,
    private permissionValidatorService: PermissionValidatorService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'Administration',
        path: null
      },
      {
        name: 'Configuration',
        path: null
      },
      {
        name: 'marketplaces',
        path: null
      }
    ];

    this.products$ = this.productReferencesFacade.productReferences$;
    this.productsConfig$ = this.productReferencesFacade.productReferencesConfig$;
    this.total$ = this.productReferencesFacade.total$;

    this.loading$ = this.productReferencesFacade.loading$;
    this.error$ = this.productReferencesFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Product.LIST_PRODUCT_REFERENCE,
      permissionTags.Product.CREATE_PRODUCT_REFERENCE,
      permissionTags.Product.ACTIVATE_PRODUCT_REFERENCE,
      permissionTags.Product.DEACTIVATE_PRODUCT_REFERENCE,
      permissionTags.Product.GET_PRODUCT_REFERENCE,
    ]);
  }

  openDialog(event: IProductReferences.IDocument) {
    const dialogRef = this.dialog.open(ProductConfirmationDialogComponent, {
      data: event,
      disableClose: true
    });
    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        return this.productReferencesFacade.toggleStatus(event);
      } else {
        return this.productReferencesFacade.resetToggle(event);
      }
    });
  }

  onRefresh(event: boolean) {
    if (event) {
      this.productReferencesFacade.onLoad();
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
    const params: IProductReferences.IConfig = {
      limit: IProductReferences.Config.LIMIT,
      page: event.pageIndex + 1
    };
    this.productReferencesFacade.setProductsPage(params);
  }
}
