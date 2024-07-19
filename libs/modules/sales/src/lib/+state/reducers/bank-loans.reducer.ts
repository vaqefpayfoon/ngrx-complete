import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { BankLoansActions } from '../actions';

import { IBankLoan } from '../../models';

export interface BankLoansState extends EntityState<IBankLoan.IDocument> {
  total: number;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<IBankLoan.IDocument> = createEntityAdapter<
  IBankLoan.IDocument
>({
  selectId: (bankLoan) => bankLoan.uuid,
});

export const initialState: BankLoansState = adapter.getInitialState({
  total: 0,
  loaded: false,
  loading: false,
  error: null,
});

const bankLoansReducer = createReducer(
  initialState,
  on(BankLoansActions.LoadBankLoansBySale, (state) => {
    return adapter.removeAll({
      ...state,
    });
  }),

  on(
    BankLoansActions.CreateBankLoansFail,
    BankLoansActions.LoadBankLoansBySaleFail,
    BankLoansActions.DeleteBankLoanFail,
    BankLoansActions.UpdateBankLoanFail,
    (state, { payload }) => {
      const error = payload;

      return {
        ...state,
        loading: false,
        loaded: false,
        error,
      };
    }
  ),

  on(
    BankLoansActions.CreateBankLoansSuccess,
    BankLoansActions.LoadBankLoansBySaleSuccess,
    (state, { payload }) => {
      return adapter.addMany(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(BankLoansActions.UpdateBankLoanSuccess, (state, { payload }) => {
    return adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    });
  }),

  on(BankLoansActions.DeleteBankLoanSuccess, (state, { payload }) => {
    return adapter.removeOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
      payload,
    });
  })
);

export function reducer(
  state: BankLoansState | undefined,
  action: BankLoansActions.BankLoansActionsUnion
) {
  return bankLoansReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Bank Loans uuids
export const selectBankLoansUuids = selectIds;

// select the dictionary of Bank Loans entities
export const selectBankLoansEntities = selectEntities;

// select the array of AllBank Loans
export const selectAllBankLoans = selectAll;

// select the total Bank Loans count
export const selectBankLoansTotal = selectTotal;
