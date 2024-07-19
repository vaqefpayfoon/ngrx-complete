import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromBankLoans from '../reducers/bank-loans.reducer';

export const getBankLoansState = createSelector(
  fromFeature.getSalesModuleState,
  (state: fromFeature.ISalesState) => state.bankLoans
);

export const getBankLoansEntities = createSelector(
  getBankLoansState,
  fromBankLoans.selectBankLoansEntities
);

export const getBankLoansUuids = createSelector(
  getBankLoansState,
  fromBankLoans.selectBankLoansUuids
);

export const getAllBankLoans = createSelector(
  getBankLoansState,
  fromBankLoans.selectAllBankLoans
);

export const getBankLoansTotals = createSelector(
  getBankLoansState,
  fromBankLoans.selectBankLoansTotal
);

export const getBankLoansLoaded = createSelector(
  getBankLoansState,
  (state: fromBankLoans.BankLoansState) => state.loaded
);

export const getBankLoansLoading = createSelector(
  getBankLoansState,
  (state: fromBankLoans.BankLoansState) => state.loading
);

export const getBankLoansError = createSelector(
  getBankLoansState,
  (state: fromBankLoans.BankLoansState) => state.error
);

export const bankLoansQuery = {
  getBankLoansUuids,
  getBankLoansEntities,
  getAllBankLoans,
  getBankLoansTotals,
  getBankLoansLoaded,
  getBankLoansLoading,
  getBankLoansError,
};
