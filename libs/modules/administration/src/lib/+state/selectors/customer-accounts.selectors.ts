import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromCustomerAccounts from '../reducers/customer-accounts.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IAccount } from '../../models';

export const getCustomerAccountsState = createSelector(
  fromFeature.getAdminState,
  (state: fromFeature.IAdminState) => state.customerAccounts
);

export const getCustomerAccountsEntities = createSelector(
  getCustomerAccountsState,
  fromCustomerAccounts.selectCustomerAccountsEntities
);

export const getCustomerAccountsUuids = createSelector(
  getCustomerAccountsState,
  fromCustomerAccounts.selectCustomerAccountsUuids
);

export const getAllCustomerAccounts = createSelector(
  getCustomerAccountsState,
  fromCustomerAccounts.selectCustomerAllAccounts
);

export const getCustomerAccountsTotals = createSelector(
  getCustomerAccountsState,
  fromCustomerAccounts.selectCustomerAccountsTotal
);

export const getCustomerAccountsTotal = createSelector(
  getCustomerAccountsState,
  (state: fromCustomerAccounts.CustomerAccountState) => state.total
);

export const getCustomerAccountsConfig = createSelector(
  getCustomerAccountsState,
  (state: fromCustomerAccounts.CustomerAccountState) => state.pagination
);

export const getCustomerAccountFilter = createSelector(
  getCustomerAccountsState,
  (state: fromCustomerAccounts.CustomerAccountState) => state.filter
);

export const getCustomerAccountSort = createSelector(
  getCustomerAccountsState,
  (state: fromCustomerAccounts.CustomerAccountState) => state.sort
);

export const getCustomerAccountsPage = createSelector(
  getCustomerAccountsConfig,
  (pagination): IAccount.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1};
  }
);

export const getCustomerSelectedAccount = createSelector(
  getCustomerAccountsState,
  (state: fromCustomerAccounts.CustomerAccountState) => state.selectedCustomerAccount
);

export const getCustomerAccountsLoaded = createSelector(
  getCustomerAccountsState,
  (state: fromCustomerAccounts.CustomerAccountState) => state.loaded
);

export const getCustomerAccountsLoading = createSelector(
  getCustomerAccountsState,
  (state: fromCustomerAccounts.CustomerAccountState) => state.loading
);

export const getCustomerAccountsError = createSelector(
  getCustomerAccountsState,
  (state: fromCustomerAccounts.CustomerAccountState) => state.error
);

export const customerAccountQuery = {
  getCustomerAccountsState,
  getCustomerAccountsEntities,
  getCustomerAccountsUuids,
  getAllCustomerAccounts,
  getCustomerAccountsTotals,
  getCustomerAccountsTotal,
  getCustomerAccountFilter,
  getCustomerAccountSort,
  getCustomerAccountsConfig,
  getCustomerAccountsPage,
  getCustomerSelectedAccount,
  getCustomerAccountsLoaded,
  getCustomerAccountsLoading,
  getCustomerAccountsError
};
