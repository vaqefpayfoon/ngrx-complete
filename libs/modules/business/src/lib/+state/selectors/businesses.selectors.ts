import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromBusinesses from '../reducers/businesses.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IBusinesses } from '../../models';

export const getBusinessesState = createSelector(
  fromFeature.getBusinessState,
  (state: fromFeature.IBusinessesState) => state.business
);

export const getAccountsState = createSelector(
  fromFeature.getBusinessState,
  (state: fromFeature.IBusinessesState) => state.accounts
);

export const getBusinessesEntities = createSelector(
  getBusinessesState,
  fromBusinesses.selectBusinessesEntities
);

export const getBusinessesUuids = createSelector(
  getBusinessesState,
  fromBusinesses.selectBusinessesUuids
);

export const getAllBusinesses = createSelector(
  getBusinessesState,
  fromBusinesses.selectAllBusinesses
);

export const getBusinessesTotals = createSelector(
  getBusinessesState,
  fromBusinesses.selectBusinessesTotal
);

export const getBusinessesTotal = createSelector(
  getBusinessesState,
  (state: fromBusinesses.BusinessState) => state.total
);

export const getBusinessesConfig = createSelector(
  getBusinessesState,
  (state: fromBusinesses.BusinessState) => state.pagination
);

export const getBusinessesPage = createSelector(
  getBusinessesConfig,
  (pagination): IBusinesses.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getSelectedBusiness = createSelector(
  getBusinessesState,
  (state: fromBusinesses.BusinessState) => state.selectedBusiness
);

export const getBusinessesLoaded = createSelector(
  getBusinessesState,
  (state: fromBusinesses.BusinessState) => state.loaded
);

export const getBusinessesLoading = createSelector(
  getBusinessesState,
  (state: fromBusinesses.BusinessState) => state.loading
);

export const getBusinessesError = createSelector(
  getBusinessesState,
  (state: fromBusinesses.BusinessState) => state.error
);

export const getAccountsEntities = createSelector(
  getAccountsState,
  fromBusinesses.selectEntitiesAccounts
);

export const getAllAccounts = createSelector(
  getAccountsState,
  fromBusinesses.selectAllAccounts
);

export const getAccountsSearchParams = createSelector(
  getAccountsState,
  (state: fromBusinesses.AccountState) => state.search
);

export const getAccountsLoaded = createSelector(
  getAccountsState,
  (state: fromBusinesses.AccountState) => state.loaded
);

export const getAccountsLoading = createSelector(
  getAccountsState,
  (state: fromBusinesses.AccountState) => state.loading
);

export const getAccountsError = createSelector(
  getAccountsState,
  (state: fromBusinesses.AccountState) => state.error
);

export const getAccountsTotal = createSelector(
  getAccountsState,
  fromBusinesses.selectTotalAccounts
);

export const getAccountsConfig = createSelector(
  getAccountsState,
  (state: fromBusinesses.AccountState) => state.pagination
);

export const getAccountsPage = createSelector(
  getAccountsConfig,
  (pagination): IBusinesses.IPagination => {
    return pagination
      ? {
          limit: pagination.limit,
          page: pagination.page,
          pages: pagination.pages,
          total: pagination.total
        }
      : null;
  }
);

export const BusinessQuery = {
  getBusinessesState,
  getBusinessesEntities,
  getBusinessesUuids,
  getAllBusinesses,
  getBusinessesTotals,
  getBusinessesTotal,
  getBusinessesConfig,
  getBusinessesPage,
  getSelectedBusiness,
  getBusinessesLoaded,
  getBusinessesLoading,
  getBusinessesError,
  getAccountsState,
  getAccountsEntities,
  getAllAccounts,
  getAccountsLoaded,
  getAccountsLoading,
  getAccountsError,
  getAccountsTotal,
  getAccountsConfig,
  getAccountsPage,
  getAccountsSearchParams
};
