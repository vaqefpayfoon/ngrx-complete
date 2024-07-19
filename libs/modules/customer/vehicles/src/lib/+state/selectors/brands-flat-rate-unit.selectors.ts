import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromBrandsFlatRateUnit from '../reducers/brands-flat-rate-unit.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IBrandsFlatRateUnit } from '../../models';

export const getBrandsFlatRateUnitState = createSelector(
  fromFeature.getCorporateVehiclesState,
  (state: fromFeature.IVehiclesState) => state.brandsFlatRateUnit
);

export const getAllBrandsFlatRateUnit = createSelector(
  getBrandsFlatRateUnitState,
  (state: fromBrandsFlatRateUnit.BrandsFlatRateUnitState) =>
    state.brandsFlatRateUnit
);

export const getRemainBrandsFlatRateUnit = createSelector(
  getBrandsFlatRateUnitState,
  (state: fromBrandsFlatRateUnit.BrandsFlatRateUnitState) =>
    state.remainingBrands
);

export const getBrandsFlatRateUnitTotal = createSelector(
  getBrandsFlatRateUnitState,
  (state: fromBrandsFlatRateUnit.BrandsFlatRateUnitState) => state.total
);

export const getBrandsFlatRateUnitPending = createSelector(
  getBrandsFlatRateUnitState,
  (state: fromBrandsFlatRateUnit.BrandsFlatRateUnitState) => state.pending
);

export const getBrandsFlatRateUnitLoaded = createSelector(
  getBrandsFlatRateUnitState,
  (state: fromBrandsFlatRateUnit.BrandsFlatRateUnitState) => state.loaded
);

export const getBrandsFlatRateUnitLoading = createSelector(
  getBrandsFlatRateUnitState,
  (state: fromBrandsFlatRateUnit.BrandsFlatRateUnitState) => state.loading
);

export const getBrandsFlatRateUnitError = createSelector(
  getBrandsFlatRateUnitState,
  (state: fromBrandsFlatRateUnit.BrandsFlatRateUnitState) => state.error
);

export const brandsFlatRateUnitQuery = {
  getBrandsFlatRateUnitState,
  getAllBrandsFlatRateUnit,
  getRemainBrandsFlatRateUnit,
  getBrandsFlatRateUnitTotal,
  getBrandsFlatRateUnitPending,
  getBrandsFlatRateUnitLoaded,
  getBrandsFlatRateUnitLoading,
  getBrandsFlatRateUnitError
};
