import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromPurchaseQuotes from '../reducers/purchase-quotes.reducer';

import { ISales } from '../../models';

export const getPurchaseQuotesState = createSelector(
  fromFeature.getSalesModuleState,
  (state: fromFeature.ISalesState) => state.purchaseQuotes
);

export const getPurchaseQuotesEntities = createSelector(
  getPurchaseQuotesState,
  fromPurchaseQuotes.selectPurchaseQuotesEntities
);

export const getPurchaseQuotesUuids = createSelector(
  getPurchaseQuotesState,
  fromPurchaseQuotes.selectPurchaseQuotesUuids
);

export const getAllPurchaseQuotes = createSelector(
  getPurchaseQuotesState,
  fromPurchaseQuotes.selectAllPurchaseQuotes
);

export const getPurchaseQuotesTotals = createSelector(
  getPurchaseQuotesState,
  fromPurchaseQuotes.selectPurchaseQuotesTotal
);

export const getPurchaseQuotesTotal = createSelector(
  getPurchaseQuotesState,
  (state: fromPurchaseQuotes.PurchaseQuotesState) => state.total
);

export const getPurchaseQuotesConfig = createSelector(
  getPurchaseQuotesState,
  (state: fromPurchaseQuotes.PurchaseQuotesState) => state.pagination
);

export const getPurchaseQuotesFilters = createSelector(
  getPurchaseQuotesState,
  (state: fromPurchaseQuotes.PurchaseQuotesState) => state.filters
);

export const getPurchaseQuotesSorts = createSelector(
  getPurchaseQuotesState,
  (state: fromPurchaseQuotes.PurchaseQuotesState) => state.sorts
);

export const getPurchaseQuotesPage = createSelector(
  getPurchaseQuotesConfig,
  (pagination): ISales.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getQuotesSalesAdvisor = createSelector(
  getPurchaseQuotesState,
  (state: fromPurchaseQuotes.PurchaseQuotesState) => state.salesAdvisor
);

export const getSelectedPurchaseQuote = createSelector(
  getPurchaseQuotesState,
  (state: fromPurchaseQuotes.PurchaseQuotesState) => state.selectedPurchase
);

export const getPurchaseQuotesLoaded = createSelector(
  getPurchaseQuotesState,
  (state: fromPurchaseQuotes.PurchaseQuotesState) => state.loaded
);

export const getPurchaseQuotesLoading = createSelector(
  getPurchaseQuotesState,
  (state: fromPurchaseQuotes.PurchaseQuotesState) => state.loading
);

export const getPurchaseQuotesError = createSelector(
  getPurchaseQuotesState,
  (state: fromPurchaseQuotes.PurchaseQuotesState) => state.error
);

export const getQuotesUnit = createSelector(
  getPurchaseQuotesState,
  (state: fromPurchaseQuotes.PurchaseQuotesState) => state.unit
);

export const getQuotesGlobalVehicle = createSelector(
  getPurchaseQuotesState,
  (state: fromPurchaseQuotes.PurchaseQuotesState) => state.globalVehicles
);

export const purchaseQuoteQuery = {
  getPurchaseQuotesState,
  getPurchaseQuotesEntities,
  getPurchaseQuotesUuids,
  getAllPurchaseQuotes,
  getPurchaseQuotesTotals,
  getPurchaseQuotesTotal,
  getPurchaseQuotesConfig,
  getPurchaseQuotesFilters,
  getPurchaseQuotesSorts,
  getPurchaseQuotesPage,
  getSelectedPurchaseQuote,
  getPurchaseQuotesLoaded,
  getPurchaseQuotesLoading,
  getPurchaseQuotesError,
  getQuotesSalesAdvisor,
  getQuotesUnit,
  getQuotesGlobalVehicle,
};
