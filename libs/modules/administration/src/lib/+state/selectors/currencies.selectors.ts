import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromCurrencies from '../reducers/currencies.reducer';

export const getCurrenciesState = createSelector(
  fromFeature.getAdminState,
  (state: fromFeature.IAdminState) => state.currencies
);

export const getAllCurrencies = createSelector(
  getCurrenciesState,
  (state: fromCurrencies.CurrenciesState) => state.data
);

export const getCurrenciesLoaded = createSelector(
  getCurrenciesState,
  (state: fromCurrencies.CurrenciesState) => state.loaded
);

export const getCurrenciesLoading = createSelector(
  getCurrenciesState,
  (state: fromCurrencies.CurrenciesState) => state.loading
);

export const CurrenciesQuery = {
  getCurrenciesState,
  getAllCurrencies,
  getCurrenciesLoaded,
  getCurrenciesLoading
};
