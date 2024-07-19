import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromPurchases from '../reducers/purchases.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { ISales } from '../../models';

export const getPurchasesState = createSelector(
  fromFeature.getSalesModuleState,
  (state: fromFeature.ISalesState) => state.purchases
);

export const getPurchasesEntities = createSelector(
  getPurchasesState,
  fromPurchases.selectPurchasesEntities
);

export const getPurchasesUuids = createSelector(
  getPurchasesState,
  fromPurchases.selectPurchasesUuids
);

export const getAllPurchases = createSelector(
  getPurchasesState,
  fromPurchases.selectAllPurchases
);

export const getPurchasesTotals = createSelector(
  getPurchasesState,
  fromPurchases.selectPurchasesTotal
);

export const getPurchasesTotal = createSelector(
  getPurchasesState,
  (state: fromPurchases.PurchasesState) => state.total
);

export const getPurchasesConfig = createSelector(
  getPurchasesState,
  (state: fromPurchases.PurchasesState) => state.pagination
);

export const getPurchasesFilters = createSelector(
  getPurchasesState,
  (state: fromPurchases.PurchasesState) => state.filters
);

export const getPurchasesSorts = createSelector(
  getPurchasesState,
  (state: fromPurchases.PurchasesState) => state.sorts
);

export const getPurchasesPage = createSelector(
  getPurchasesConfig,
  (pagination): ISales.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getSelectedPurchase = createSelector(
  getPurchasesState,
  (state: fromPurchases.PurchasesState) => state.selectedPurchase
);

export const getSalesAdvisor = createSelector(
  getPurchasesState,
  (state: fromPurchases.PurchasesState) => state.salesAdvisor
);

export const getUnit = createSelector(
  getPurchasesState,
  (state: fromPurchases.PurchasesState) => state.unit
);

export const getGlobalVehicle = createSelector(
  getPurchasesState,
  (state: fromPurchases.PurchasesState) => state.globalVehicles
);

export const getPurchasesLoaded = createSelector(
  getPurchasesState,
  (state: fromPurchases.PurchasesState) => state.loaded
);

export const getPurchasesLoading = createSelector(
  getPurchasesState,
  (state: fromPurchases.PurchasesState) => state.loading
);

export const getPurchasesError = createSelector(
  getPurchasesState,
  (state: fromPurchases.PurchasesState) => state.error
);

export const purchaseQuery = {
  getPurchasesUuids,
  getPurchasesEntities,
  getAllPurchases,
  getPurchasesTotal,
  getPurchasesTotals,
  getPurchasesConfig,
  getPurchasesPage,
  getSelectedPurchase,
  getPurchasesLoaded,
  getPurchasesLoading,
  getPurchasesError,
  getPurchasesFilters,
  getPurchasesSorts,
  getSalesAdvisor,
  getUnit,
  getGlobalVehicle,
};
