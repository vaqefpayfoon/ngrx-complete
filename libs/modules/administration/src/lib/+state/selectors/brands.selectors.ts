import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';

import * as fromBrands from '../reducers/brands.reducers';

export const getBrandsState = createSelector(
  fromFeature.getAdminState,
  (state: fromFeature.IAdminState) => state.brands
);

export const getGlobalBrands = createSelector(
  getBrandsState,
  (state: fromBrands.BrandsState) => state.brands
);

export const brandsQuery = {
  getBrandsState,
  getGlobalBrands,
};
