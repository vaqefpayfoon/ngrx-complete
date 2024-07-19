import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IMarketplacesState } from '../reducers';

// Selector
import { productCoveragesQuery } from '../selectors';

// Action
import { ProductCoveragesActions } from '../actions';

// Models
import { IProductCoverages } from '../../models';

@Injectable()
export class ProductCoveragesFacade {
  productCoverages$ = this.store.select(
    productCoveragesQuery.getAllProductCoverages
  );

  total$ = this.store.select(productCoveragesQuery.getProductCoveragesTotal);

  productCoveragesConfig$ = this.store.select(
    productCoveragesQuery.getProductCoveragesPage
  );

  productCoverage$ = this.store.select(
    productCoveragesQuery.getSelectedProductCoverage
  );

  list$ = this.store.select(productCoveragesQuery.getProductCoverageList);

  loading$ = this.store.select(
    productCoveragesQuery.getProductCoveragesLoading
  );

  loaded$ = this.store.select(productCoveragesQuery.getProductCoveragesLoaded);

  error$ = this.store.select(productCoveragesQuery.getProductCoveragesError);

  constructor(private store: Store<IMarketplacesState>) {}

  setProductsPage(config: IProductCoverages.IConfig) {
    this.store.dispatch(
      ProductCoveragesActions.SetProductCoveragesPage({ payload: config })
    );
  }

  toggleStatus(product: IProductCoverages.IDocument) {
    if (product.active) {
      this.store.dispatch(
        ProductCoveragesActions.DeactivateProductCoverage({
          payload: product,
        })
      );
    } else {
      this.store.dispatch(
        ProductCoveragesActions.ActivateProductCoverage({ payload: product })
      );
    }
  }

  resetToggle(product: IProductCoverages.IDocument) {
    this.store.dispatch(
      ProductCoveragesActions.ResetProductCoverageStatus({
        payload: {
          id: product.uuid,
          changes: {
            active: product.active,
          },
        },
      })
    );
  }

  onLoad() {
    this.store.dispatch(ProductCoveragesActions.LoadProductCoverages());
  }

  create(product: IProductCoverages.ICreate) {
    this.store.dispatch(
      ProductCoveragesActions.CreateProductCoverage({ payload: product })
    );
  }

  update(product: IProductCoverages.IDocument) {
    this.store.dispatch(
      ProductCoveragesActions.UpdateProductCoverage({ payload: product })
    );
  }

  delete(product: IProductCoverages.IDocument) {
    this.store.dispatch(
      ProductCoveragesActions.DeleteProductCoverage({ payload: product })
    );
  }

  resetProductCoverageList(list: string) {
    this.store.dispatch(ProductCoveragesActions.ResetList({ payload: list }));
  }

  onResetSelectedProductCoverage() {
    this.store.dispatch(ProductCoveragesActions.ResetSelectedProductCoverage());
  }

  onLoadBrand(serviceType: string) {
    this.store.dispatch(
      ProductCoveragesActions.LoadProductBrands({ payload: serviceType })
    );
  }

  onLoadModel(brand: string, serviceType: string) {
    this.store.dispatch(
      ProductCoveragesActions.LoadProductModels({
        payload: { brand, serviceType },
      })
    );
  }

  onRedirect() {
    this.store.dispatch(ProductCoveragesActions.RedirectToProductCoverages());
  }

  getProductCoverage(uuid: string) {
    this.store.dispatch(
      ProductCoveragesActions.GetProductCoverage({ payload: uuid })
    );
  }
}
