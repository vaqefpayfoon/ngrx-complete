import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromValuations from '../reducers/valuations.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { ISales } from '../../models';

export const getValuationsState = createSelector(
  fromFeature.getSalesModuleState,
  (state: fromFeature.ISalesState) => state.valuations
);

export const getValuationsEntities = createSelector(
  getValuationsState,
  fromValuations.selectValuationsEntities
);

export const getValuationsUuids = createSelector(
  getValuationsState,
  fromValuations.selectValuationsUuids
);

export const getAllValuations = createSelector(
  getValuationsState,
  fromValuations.selectAllValuations
);

export const getValuationsTotals = createSelector(
  getValuationsState,
  fromValuations.selectValuationsTotal
);

export const getValuationsTotal = createSelector(
  getValuationsState,
  (state: fromValuations.ValuationsState) => state.total
);

export const getValuationsConfig = createSelector(
  getValuationsState,
  (state: fromValuations.ValuationsState) => state.pagination
);

export const getValuationsFilters = createSelector(
  getValuationsState,
  (state: fromValuations.ValuationsState) => state.filters
);

export const getValuationsSorts = createSelector(
  getValuationsState,
  (state: fromValuations.ValuationsState) => state.sorts
);

export const getValuationsPage = createSelector(
  getValuationsConfig,
  (pagination): ISales.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getSelectedValuation = createSelector(
  getValuationsState,
  (state: fromValuations.ValuationsState) => state.selectedValuation
);

export const getValuationsLoaded = createSelector(
  getValuationsState,
  (state: fromValuations.ValuationsState) => state.loaded
);

export const getValuationsLoading = createSelector(
  getValuationsState,
  (state: fromValuations.ValuationsState) => state.loading
);

export const getValuationsError = createSelector(
  getValuationsState,
  (state: fromValuations.ValuationsState) => state.error
);

export const valuationQuery = {
  getValuationsUuids,
  getValuationsEntities,
  getAllValuations,
  getValuationsTotal,
  getValuationsTotals,
  getValuationsConfig,
  getValuationsPage,
  getSelectedValuation,
  getValuationsLoaded,
  getValuationsLoading,
  getValuationsError,
  getValuationsFilters,
  getValuationsSorts,
};
