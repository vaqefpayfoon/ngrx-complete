import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromProductCoverages from '../reducers/product-coverages.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IProductCoverages } from '../../models';

export const getProductCoveragestate = createSelector(
  fromFeature.getMarketplacesState,
  (state: fromFeature.IMarketplacesState) => state.productCoverages
);

export const getProductCoveragesUuids = createSelector(
  getProductCoveragestate,
  fromProductCoverages.selectCoveragesUuids
);

export const getProductCoveragesEntities = createSelector(
  getProductCoveragestate,
  fromProductCoverages.selectCoveragesEntities
);

export const getAllProductCoverages = createSelector(
  getProductCoveragestate,
  fromProductCoverages.selectAllCoverages
);

export const getSelectedProductCoverage = createSelector(
  getProductCoveragestate,
  (state: fromProductCoverages.CoveragesState) => state.selectedProductCoverage
);

export const getProductCoveragesConfig = createSelector(
  getProductCoveragestate,
  (state: fromProductCoverages.CoveragesState) => state.pagination
);

export const getProductCoveragesPage = createSelector(
  getProductCoveragesConfig,
  (pagination): IProductCoverages.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getProductCoverageList = createSelector(
  getProductCoveragestate,
  (state: fromProductCoverages.CoveragesState) => state.list
);

export const getProductCoveragesTotals = createSelector(
  getProductCoveragestate,
  fromProductCoverages.selectCoveragesTotal
);

export const getProductCoveragesTotal = createSelector(
  getProductCoveragestate,
  (state: fromProductCoverages.CoveragesState) => state.total
);

export const getProductCoveragesLoaded = createSelector(
  getProductCoveragestate,
  (state: fromProductCoverages.CoveragesState) => state.loaded
);

export const getProductCoveragesLoading = createSelector(
  getProductCoveragestate,
  (state: fromProductCoverages.CoveragesState) => state.loading
);

export const getProductCoveragesError = createSelector(
  getProductCoveragestate,
  (state: fromProductCoverages.CoveragesState) => state.error
);

export const productCoveragesQuery = {
  getProductCoveragestate,
  getProductCoveragesUuids,
  getProductCoveragesEntities,
  getAllProductCoverages,
  getProductCoverageList,
  getSelectedProductCoverage,
  getProductCoveragesConfig,
  getProductCoveragesPage,
  getProductCoveragesTotals,
  getProductCoveragesTotal,
  getProductCoveragesLoaded,
  getProductCoveragesLoading,
  getProductCoveragesError
};
