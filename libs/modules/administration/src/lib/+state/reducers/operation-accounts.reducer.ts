import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { OperationAccountsActions } from '../actions';

import { IAccount } from '../../models';

export interface OperationAccountState extends EntityState<IAccount.IDocument> {
  total: number;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  filter: IAccount.IFilter;
  selectedOperationAccount: IAccount.IDocument;
  sort: IAccount.ISort;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<IAccount.IDocument> = createEntityAdapter<
  IAccount.IDocument
>({
  selectId: account => account.uuid,
});

export const initialState: OperationAccountState = adapter.getInitialState({
  total: 0,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1
  },
  filter: null,
  selectedOperationAccount: null,
  sort: null,
  loaded: false,
  loading: false,
  error: null
});

const operationAccountReducer = createReducer(
  initialState,

  on(
    OperationAccountsActions.SetOperationAccountsPage,
    (state, { payload }) => {
      const { page, limit } = payload;
      return {
        ...state,
        error: null,
        pagination: {
          ...state.pagination,
          page,
          limit
        }
      };
    }
  ),

  on(OperationAccountsActions.LoadOperationAccounts, state => {
    return adapter.removeAll({
      ...state,
      loading: true,
      loaded: false,
      error: null
    });
  }),

  on(
    OperationAccountsActions.LoadOperationAccountsFail,
    OperationAccountsActions.CreateOperationAccountFail,
    OperationAccountsActions.DeactivateOperationAccountFail,
    OperationAccountsActions.GetOperationAccountFail,
    OperationAccountsActions.UpdateOperationAccountFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loading: false, loaded: false, error };
    }
  ),

  on(OperationAccountsActions.GetOperationAccountSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedOperationAccount: payload,
      error: null
    })
  ),

  on(
    OperationAccountsActions.LoadOperationAccountsSuccess,
    (state, { accounts, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.addAll(accounts, {
        ...state,
        total,
        pagination: {
          ...state.pagination,
          page,
          pages,
          limit
        },
        loading: false,
        loaded: true,
        error: null
      });
    }
  ),

  on(
    OperationAccountsActions.CreateOperationAccountSuccess,
    (state, { payload }) =>
      adapter.addOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      })
  ),

  on(
    OperationAccountsActions.UpdateOperationAccountSuccess,
    (state, { payload }) =>
      adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      })
  ),

  on(
    OperationAccountsActions.ActivateOperationAccountSuccess,
    OperationAccountsActions.DeactivateOperationAccountSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      });
    }
  ),

  on(
    OperationAccountsActions.DeleteOperationAccountSuccess,
    (state, { payload }) =>
      adapter.removeOne(payload.uuid, {
        total: state.total - 1,
        ...state,
        loading: false,
        error: null
      })
  ),

  on(OperationAccountsActions.UpdateOperationAccount, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(
    OperationAccountsActions.ResetOperationAccountStatus,
    (state, { payload }) =>
      adapter.updateOne(payload, {
        ...state,
        loading: false,
        error: null
      })
  ),

  on(OperationAccountsActions.FilterOperationAccounts, (state, { payload }) => {
    return {
      ...state,
      error: null,
      filter: payload
    };
  }),

  on(OperationAccountsActions.ResetFilterOperationAccounts, state => {
    return {
      ...state,
      error: null,
      filter: null
    };
  }),

  on(OperationAccountsActions.ResetSortOperationAccounts, state => {
    return {
      ...state,
      error: null,
      sort: null
    };
  }),

  on(OperationAccountsActions.ResetSelectedOperationAccount, (state) => {
    return {
      ...state,
      selectedOperationAccount: null,
    };
  }),

  on(OperationAccountsActions.SortOperationAccounts, (state, { payload }) => {
    return {
      ...state,
      error: null,
      sort: payload
    };
  })
);

export function reducer(
  state: OperationAccountState | undefined,
  action: OperationAccountsActions.OperationAccountsActionsUnion
) {
  return operationAccountReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

// select the array of Operation Accounts uuids
export const selectOperationAccountsUuids = selectIds;

// select the dictionary of Operation Accounts entities
export const selectOperationAccountsEntities = selectEntities;

// select the array of Operation Accounts
export const selectOperationAllAccounts = selectAll;

// select the total Operation Accounts count
export const selectOperationAccountsTotal = selectTotal;
