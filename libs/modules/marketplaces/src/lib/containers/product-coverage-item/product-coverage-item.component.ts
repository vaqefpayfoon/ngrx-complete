import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import {  IBC } from '@neural/shared/data';

// Models
import { IProductCoverages } from '../../models';

// Services
import { IServices, ServicesFacade } from '@neural/modules/customer/services';

// Facades
import { ProductCoveragesFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-product-coverage-item',
  templateUrl: './product-coverage-item.component.html',
  styleUrls: ['./product-coverage-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCoverageItemComponent implements OnInit, OnDestroy {
  bc: IBC[];

  productCoverage$: Observable<IProductCoverages.IDocument>;

  services$: Observable<IServices.IDocument[]>;

  list$: Observable<{
    brands: string[];
    models: IProductCoverages.IModel[];
  }>;

  branch$: Observable<Auth.IBranch>;

  permissions$: Observable<{}>;

  constructor(
    private productCoveragesFacade: ProductCoveragesFacade,
    private permissionValidatorService: PermissionValidatorService,
    private servicesFacade: ServicesFacade,
    private authFacade: AuthFacade
  ) {}

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.productCoveragesFacade.onResetSelectedProductCoverage();
  }

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null
      },
      {
        name: 'inventory',
        path: '/app/marketplaces/inventory'
      },
      {
        name: 'create',
        path: null
      }
    ];

    this.productCoverage$ = this.productCoveragesFacade.productCoverage$;

    this.services$ = this.servicesFacade.filteredService$;

    this.list$ = this.productCoveragesFacade.list$;

    this.branch$ = this.authFacade.selectedBranch;

    this.productCoveragesFacade.resetProductCoverageList('brands');
    this.productCoveragesFacade.resetProductCoverageList('models');

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Product.CREATE_PRODUCT_COVERAGE,
      permissionTags.Product.UPDATE_PRODUCT_COVERAGE
    ]);
  }

  onServiceSelect(serviceType: string) {
    this.productCoveragesFacade.resetProductCoverageList('brands');
    this.productCoveragesFacade.resetProductCoverageList('models');
    this.productCoveragesFacade.onLoadBrand(serviceType);
  }

  onBrandSelect({
    brand,
    serviceType
  }: {
    brand: string;
    serviceType: string;
  }) {
    this.productCoveragesFacade.resetProductCoverageList('models');
    this.productCoveragesFacade.onLoadModel(brand, serviceType);
  }

  onCreate(product: IProductCoverages.ICreate) {
    this.productCoveragesFacade.create(product);
  }

  onUpdate(product: IProductCoverages.IDocument) {
    this.productCoveragesFacade.update(product);
  }

  onload(product: IProductCoverages.IDocument) {
    if (product) {
      this.bc[this.bc.length - 1].name = `${product.partNumber}`;
    }
  }

  onBranchChange(event: boolean) {
    if (event) {
      this.productCoveragesFacade.onRedirect();
    }
  }
}
