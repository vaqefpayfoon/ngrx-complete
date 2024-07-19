import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';

import * as fromBrands from '../reducers/brands.reducers';

export const getBrandsState = createSelector(
  fromFeature.getCorporateState,
  (state: fromFeature.ICorporateState) => state.brands
);

export const getGlobalBrands = createSelector(
  getBrandsState,
  (state: fromBrands.BrandsState) => state.brands
);

export const brandsQuery = {
  getBrandsState,
  getGlobalBrands,
};
