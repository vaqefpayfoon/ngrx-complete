import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IMarketplacesState } from '../reducers';

// Selector
import { productReferencesQuery } from '../selectors';

// Action
import { ProductReferencesActions } from '../actions';

// Models
import { IProductReferences } from '../../models';

@Injectable()
export class ProductReferencesFacade {
  productReferences$ = this.store.select(
    productReferencesQuery.getAllProductReferencess
  );

  total$ = this.store.select(productReferencesQuery.getProductReferencesTotal);

  productReferencesConfig$ = this.store.select(
    productReferencesQuery.getProductReferencesPage
  );

  productReference$ = this.store.select(
    productReferencesQuery.getSelectedProductReference
  );

  loading$ = this.store.select(
    productReferencesQuery.getProductReferencesLoading
  );

  loaded$ = this.store.select(
    productReferencesQuery.getProductReferencesLoaded
  );

  error$ = this.store.select(productReferencesQuery.getProductReferencesError);

  constructor(private store: Store<IMarketplacesState>) {}

  setProductsPage(config: IProductReferences.IConfig) {
    this.store.dispatch(
      ProductReferencesActions.SetProductReferencesPage({ payload: config })
    );
  }

  toggleStatus(product: IProductReferences.IDocument) {
    if (product.active) {
      this.store.dispatch(
        ProductReferencesActions.DeactivateProductReference({
          payload: product,
        })
      );
    } else {
      this.store.dispatch(
        ProductReferencesActions.ActivateProductReference({ payload: product })
      );
    }
  }

  resetToggle(product: IProductReferences.IDocument) {
    this.store.dispatch(
      ProductReferencesActions.ResetProductReferenceStatus({
        payload: {
          id: product.uuid,
          changes: {
            active: product.active,
          },
        },
      })
    );
  }

  onResetSelectedProductReference() {
    this.store.dispatch(
      ProductReferencesActions.ResetSelectedProductReference()
    );
  }

  onLoad() {
    this.store.dispatch(ProductReferencesActions.LoadProductReferences());
  }

  create(product: IProductReferences.ICreate) {
    this.store.dispatch(
      ProductReferencesActions.CreateProductReference({ payload: product })
    );
  }

  update(product: IProductReferences.IDocument) {
    this.store.dispatch(
      ProductReferencesActions.UpdateProductReference({ payload: product })
    );
  }

  getProductReference(uuid: string) {
    this.store.dispatch(
      ProductReferencesActions.GetProductReference({ payload: uuid })
    );
  }
}
