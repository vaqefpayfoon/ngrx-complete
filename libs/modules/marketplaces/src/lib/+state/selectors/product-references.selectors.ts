import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromProductReferences from '../reducers/product-references.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IProductReferences } from '../../models';

export const getProductReferencestate = createSelector(
  fromFeature.getMarketplacesState,
  (state: fromFeature.IMarketplacesState) => state.productReferences
);

export const getProductReferencesUuids = createSelector(
  getProductReferencestate,
  fromProductReferences.selectReferencesUuids
);

export const getProductReferencesEntities = createSelector(
  getProductReferencestate,
  fromProductReferences.selectReferencesEntities
);

export const getAllProductReferencess = createSelector(
  getProductReferencestate,
  fromProductReferences.selectAllReferences
);

export const getSelectedProductReference = createSelector(
  getProductReferencestate,
  (state: fromProductReferences.ReferencesState) => state.selectedProductReference
);

export const getProductReferencesConfig = createSelector(
  getProductReferencestate,
  (state: fromProductReferences.ReferencesState) => state.pagination
);

export const getProductReferencesPage = createSelector(
  getProductReferencesConfig,
  (pagination): IProductReferences.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getProductReferencesTotals = createSelector(
  getProductReferencestate,
  fromProductReferences.selectReferencesTotal
);

export const getProductReferencesTotal = createSelector(
  getProductReferencestate,
  (state: fromProductReferences.ReferencesState) => state.total
);

export const getProductReferencesLoaded = createSelector(
  getProductReferencestate,
  (state: fromProductReferences.ReferencesState) => state.loaded
);

export const getProductReferencesLoading = createSelector(
  getProductReferencestate,
  (state: fromProductReferences.ReferencesState) => state.loading
);

export const getProductReferencesError = createSelector(
  getProductReferencestate,
  (state: fromProductReferences.ReferencesState) => state.error
);

export const productReferencesQuery = {
  getProductReferencestate,
  getProductReferencesUuids,
  getProductReferencesEntities,
  getAllProductReferencess,
  getSelectedProductReference,
  getProductReferencesConfig,
  getProductReferencesPage,
  getProductReferencesTotals,
  getProductReferencesTotal,
  getProductReferencesLoaded,
  getProductReferencesLoading,
  getProductReferencesError
};
