import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import {  IBC } from '@neural/shared/data';

// Models
import { IProductReferences } from '../../models';

// Facades
import { ProductReferencesFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService  } from '@neural/auth';

@Component({
  selector: 'neural-product-reference-item',
  templateUrl: './product-reference-item.component.html',
  styleUrls: ['./product-reference-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductReferenceItemComponent implements OnInit, OnDestroy {
  bc: IBC[];

  productReference$: Observable<IProductReferences.IDocument>;

  permissions$: Observable<{}>;

  constructor(
    private productReferencesFacade: ProductReferencesFacade,
    private permissionValidatorService: PermissionValidatorService,
  ) {}

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.productReferencesFacade.onResetSelectedProductReference();
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
        path: '/app/marketplaces/references'
      },
      {
        name: 'create',
        path: null
      }
    ];

    this.productReference$ = this.productReferencesFacade.productReference$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Product.CREATE_PRODUCT_REFERENCE,
      permissionTags.Product.UPDATE_PRODUCT_REFERENCE
    ]);
  }

  onCreate(product: IProductReferences.ICreate) {
    this.productReferencesFacade.create(product);
  }

  onUpdate(product: IProductReferences.IDocument) {
    this.productReferencesFacade.update(product);
  }

  onload(product: IProductReferences.IDocument) {
    if (product) {
      this.bc[this.bc.length - 1].name = `${product.unit?.brand} ${product.unit?.model}`;
    }
  }
}
