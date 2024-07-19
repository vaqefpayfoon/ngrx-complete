import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromOperationAccounts from '../reducers/operation-accounts.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IAccount } from '../../models';

export const getOperationAccountsState = createSelector(
  fromFeature.getAdminState,
  (state: fromFeature.IAdminState) => state.operationAccounts
);

export const getOperationAccountsEntities = createSelector(
  getOperationAccountsState,
  fromOperationAccounts.selectOperationAccountsEntities
);

export const getOperationAccountsUuids = createSelector(
  getOperationAccountsState,
  fromOperationAccounts.selectOperationAccountsUuids
);

export const getAllOperationAccounts = createSelector(
  getOperationAccountsState,
  fromOperationAccounts.selectOperationAllAccounts
);

export const getOperationAccountsTotals = createSelector(
  getOperationAccountsState,
  fromOperationAccounts.selectOperationAccountsTotal
);

export const getOperationAccountsTotal = createSelector(
  getOperationAccountsState,
  (state: fromOperationAccounts.OperationAccountState) => state.total
);

export const getOperationAccountsConfig = createSelector(
  getOperationAccountsState,
  (state: fromOperationAccounts.OperationAccountState) => state.pagination
);

export const getOperationAccountFilter = createSelector(
  getOperationAccountsState,
  (state: fromOperationAccounts.OperationAccountState) => state.filter
);

export const getOperationAccountSort = createSelector(
  getOperationAccountsState,
  (state: fromOperationAccounts.OperationAccountState) => state.sort
);

export const getOperationAccountsPage = createSelector(
  getOperationAccountsConfig,
  getOperationAccountFilter,
  getOperationAccountSort,
  (pagination, filter, sort): IAccount.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page, filter, sort }
      : { limit: 10, page: 1, filter: null, sort: null };
  }
);

export const getOperationSelectedAccount = createSelector(
  getOperationAccountsState,
  (state: fromOperationAccounts.OperationAccountState) => state.selectedOperationAccount
);

export const getOperationAccountsLoaded = createSelector(
  getOperationAccountsState,
  (state: fromOperationAccounts.OperationAccountState) => state.loaded
);

export const getOperationAccountsLoading = createSelector(
  getOperationAccountsState,
  (state: fromOperationAccounts.OperationAccountState) => state.loading
);

export const getOperationAccountsError = createSelector(
  getOperationAccountsState,
  (state: fromOperationAccounts.OperationAccountState) => state.error
);

export const operationAccountQuery = {
  getOperationAccountsState,
  getOperationAccountsEntities,
  getOperationAccountsUuids,
  getAllOperationAccounts,
  getOperationAccountsTotals,
  getOperationAccountsTotal,
  getOperationAccountFilter,
  getOperationAccountSort,
  getOperationAccountsConfig,
  getOperationAccountsPage,
  getOperationSelectedAccount,
  getOperationAccountsLoaded,
  getOperationAccountsLoading,
  getOperationAccountsError
};
