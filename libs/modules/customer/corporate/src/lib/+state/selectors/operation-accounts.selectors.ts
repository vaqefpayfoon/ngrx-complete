import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromOperationAccounts from '../reducers/operation-accounts.reducer';


export const getOperationAccountsState = createSelector(
  fromFeature.getCorporateState,
  (state: fromFeature.ICorporateState) => state.operationAccounts
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


export const operationAccountQuery = {
  getOperationAccountsState,
  getOperationAccountsEntities,
  getOperationAccountsUuids,
  getAllOperationAccounts,
  getOperationAccountsTotals,
  getOperationAccountsTotal
};
