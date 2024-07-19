import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromAccounts from '../reducers/accounts.reducer';

import { IAccount } from '../../models';

export const getAccountsState = createSelector(
  fromFeature.getAdminState,
  (state: fromFeature.IAdminState) => state.accounts
);

export const getAccountsEntities = createSelector(
  getAccountsState,
  fromAccounts.selectAccountsEntities
);

export const getAccountsUuids = createSelector(
  getAccountsState,
  fromAccounts.selectAccountsUuids
);

export const getAllAccounts = createSelector(
  getAccountsState,
  fromAccounts.selectAllAccounts
);

export const getAccountsTotals = createSelector(
  getAccountsState,
  fromAccounts.selectAccountsTotal
);

export const getAccountsTotal = createSelector(
  getAccountsState,
  (state: fromAccounts.AccountState) => state.total
);

export const getAccountsConfig = createSelector(
  getAccountsState,
  (state: fromAccounts.AccountState) => state.pagination
);

export const getAccountFilter = createSelector(
  getAccountsState,
  (state: fromAccounts.AccountState) => state.filter
);

export const getAccountSort = createSelector(
  getAccountsState,
  (state: fromAccounts.AccountState) => state.sort
);

export const getSearchedAccount = createSelector(
  getAccountsState,
  (state: fromAccounts.AccountState) => state.searchedAccount
);

export const getAccountsPage = createSelector(
  getAccountsConfig,
  getAccountFilter,
  getAccountSort,
  (pagination, filter, sort): IAccount.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page, filter, sort }
      : { limit: 10, page: 1, filter: null, sort: null };
  }
);

export const getSelectedAccount = createSelector(
  getAccountsState,
  (state: fromAccounts.AccountState) => state.selectedAccount
);

export const getAccountsLoaded = createSelector(
  getAccountsState,
  (state: fromAccounts.AccountState) => state.loaded
);

export const getAccountsLoading = createSelector(
  getAccountsState,
  (state: fromAccounts.AccountState) => state.loading
);

export const getAccountsError = createSelector(
  getAccountsState,
  (state: fromAccounts.AccountState) => state.error
);

export const accountQuery = {
  getAccountsUuids,
  getAccountsEntities,
  getAllAccounts,
  getAccountsTotal,
  getAccountsTotals,
  getAccountsConfig,
  getAccountsPage,
  getSelectedAccount,
  getAccountsLoaded,
  getAccountsLoading,
  getAccountsError,
  getSearchedAccount,
  getAccountFilter
};
