import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { CustomerAccountsActions } from '../actions';

import { IAccount } from '../../models';

export interface CustomerAccountState extends EntityState<IAccount.IDocument> {
  total: number;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  filter: IAccount.IFilter;
  selectedCustomerAccount: IAccount.IDocument;
  sort: IAccount.ISort;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<IAccount.IDocument> = createEntityAdapter<
  IAccount.IDocument
>({
  selectId: account => account.uuid
});

export const initialState: CustomerAccountState = adapter.getInitialState({
  total: 0,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1
  },
  filter: null,
  selectedCustomerAccount: null,
  sort: null,
  loaded: false,
  loading: false,
  error: null
});

const customerAccountReducer = createReducer(
  initialState,

  on(CustomerAccountsActions.SetCustomerAccountsPage, (state, { payload }) => {
    const { page, limit } = payload;
    return {
      ...state,
      error: null,
      selectedCustomerAccount: null,
      pagination: {
        ...state.pagination,
        page,
        limit
      }
    };
  }),

  on(CustomerAccountsActions.LoadCustomerAccounts, state => {
    return adapter.removeAll({
      ...state,
      loading: true,
      loaded: false,
      error: null
    });
  }),

  on(
    CustomerAccountsActions.LoadCustomerAccountsFail,
    CustomerAccountsActions.CreateCustomerAccountFail,
    CustomerAccountsActions.DeactivateCustomerAccountFail,
    CustomerAccountsActions.GetCustomerAccountFail,
    CustomerAccountsActions.UpdateCustomerAccountFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loading: false, loaded: false, error };
    }
  ),

  on(CustomerAccountsActions.GetCustomerAccountSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedCustomerAccount: payload,
      error: null
    })
  ),

  on(
    CustomerAccountsActions.LoadCustomerAccountsSuccess,
    (state, { accounts, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.setAll(accounts, {
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
    CustomerAccountsActions.CreateCustomerAccountSuccess,
    (state, { payload }) =>
      adapter.addOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      })
  ),

  on(
    CustomerAccountsActions.UpdateCustomerAccountSuccess,
    (state, { payload }) =>
      adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      })
  ),

  on(
    CustomerAccountsActions.ActivateCustomerAccountSuccess,
    CustomerAccountsActions.DeactivateCustomerAccountSuccess,
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
    CustomerAccountsActions.DeleteCustomerAccountSuccess,
    (state, { payload }) =>
      adapter.removeOne(payload.uuid, {
        total: state.total - 1,
        ...state,
        loading: false,
        error: null
      })
  ),

  on(CustomerAccountsActions.UpdateCustomerAccount, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CustomerAccountsActions.ResetCustomerAccountStatus, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      error: null
    })
  ),

  on(CustomerAccountsActions.FilterCustomerAccounts, (state, { payload }) => {
    return {
      ...state,
      error: null,
      filter: payload,
      pagination: {
        limit: IAccount.Config.LIMIT,
        page: 1,
        pages: 1,
      },
    };
  }),

  on(CustomerAccountsActions.ResetFilterCustomerAccounts, state => {
    return {
      ...state,
      error: null,
      filter: null
    };
  }),

  on(CustomerAccountsActions.ResetSortCustomerAccounts, state => {
    return {
      ...state,
      error: null,
      sort: null
    };
  }),

  on(CustomerAccountsActions.ResetSelectedCustomerAccount, (state) => {
    return {
      ...state,
      selectedCustomerAccount: null,
    };
  }),

  on(CustomerAccountsActions.SortCustomerAccounts, (state, { payload }) => {
    return {
      ...state,
      error: null,
      sort: payload
    };
  })
);

export function reducer(
  state: CustomerAccountState | undefined,
  action: CustomerAccountsActions.CustomerAccountsActionsUnion
) {
  return customerAccountReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

// select the array of Customer Accounts uuids
export const selectCustomerAccountsUuids = selectIds;

// select the dictionary of Customer Accounts entities
export const selectCustomerAccountsEntities = selectEntities;

// select the array of Customer Accounts
export const selectCustomerAllAccounts = selectAll;

// select the total Customer Accounts count
export const selectCustomerAccountsTotal = selectTotal;
