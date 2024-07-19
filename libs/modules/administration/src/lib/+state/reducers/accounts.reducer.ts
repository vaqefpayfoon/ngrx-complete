import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { AccountsActions } from '../actions';

import { IAccount } from '../../models';

export interface AccountState extends EntityState<IAccount.IDocument> {
  searchedAccount: IAccount.IDocument | null;
  brands: string[] | null;
  total: number;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  filter: IAccount.IFilter;
  selectedAccount: IAccount.IDocument;
  sort: IAccount.ISort;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<IAccount.IDocument> = createEntityAdapter<
  IAccount.IDocument
>({
  selectId: (account) => account.uuid,
});

export const initialState: AccountState = adapter.getInitialState({
  searchedAccount: null,
  brands: null,
  total: 0,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
  },
  filter: null,
  selectedAccount: null,
  sort: null,
  loaded: false,
  loading: false,
  error: null,
});

const accountReducer = createReducer(
  initialState,

  on(AccountsActions.SetAccountsPage, (state, { payload }) => {
    const { page, limit } = payload;
    return adapter.removeAll({
      ...state,
      pagination: {
        ...state.pagination,
        page,
        limit,
      },
    });
  }),

  on(AccountsActions.LoadAccounts, (state) => {
    return adapter.removeAll({
      ...state,
      loading: true,
      loaded: false,
      error: null,
    });
  }),

  on(AccountsActions.FilterAccounts, (state, { payload }) => {
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

  on(AccountsActions.ResetFilterAccounts, (state) => {
    return {
      ...state,
      error: null,
      filter: null,
    };
  }),

  on(AccountsActions.ResetSortAccounts, (state) => {
    return {
      ...state,
      error: null,
      sort: null,
    };
  }),

  on(AccountsActions.SortAccounts, (state, { payload }) => {
    return {
      ...state,
      error: null,
      sort: payload,
    };
  }),

  on(
    AccountsActions.LoadAccountsFail,
    AccountsActions.CreateAccountFail,
    AccountsActions.DeactivateAccountFail,
    AccountsActions.GetAccountFail,
    AccountsActions.UpdateAccountFail,
    AccountsActions.UpdatePasswordFail,
    AccountsActions.SearchAccountFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loading: false, loaded: false, error };
    }
  ),

  on(AccountsActions.GetAccountSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedAccount: payload,
      error: null,
    })
  ),

  on(AccountsActions.LoadAccountsSuccess, (state, { accounts, pagination }) => {
    const { page, pages, limit, total } = pagination;
    return adapter.setAll(accounts, {
      ...state,
      total,
      pagination: {
        ...state.pagination,
        page,
        pages,
        limit,
      },
      loading: false,
      loaded: true,
      error: null,
    });
  }),

  on(AccountsActions.CreateAccountSuccess, (state, { payload }) =>
    adapter.addOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    })
  ),

  on(AccountsActions.UpdateAccountSuccess, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    })
  ),

  on(
    AccountsActions.ActivateAccountSuccess,
    AccountsActions.DeactivateAccountSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(AccountsActions.DeleteAccountSuccess, (state, { payload }) =>
    adapter.removeOne(payload.uuid, {
      ...state,
      total: state.total - 1,
      loading: false,
      error: null,
    })
  ),

  on(AccountsActions.UpdateAccount, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AccountsActions.ResetAccountStatus, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(AccountsActions.SearchAccountSuccess, (state, { payload }) => {
    const searchedAccount = payload;
    return {
      ...state,
      searchedAccount,
      error: null,
      loading: false,
    };
  }),

  on(AccountsActions.ResetSearchedAccount, (state) => {
    return {
      ...state,
      searchedAccount: null,
      error: null,
      loading: false,
    };
  }),

  on(AccountsActions.ResetSelectedAccount, (state) => {
    return {
      ...state,
      selectedAccount: null,
    };
  })
);

export function reducer(
  state: AccountState | undefined,
  action: AccountsActions.AccountsActionsUnion
) {
  return accountReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Accounts uuids
export const selectAccountsUuids = selectIds;

// select the dictionary of Accounts entities
export const selectAccountsEntities = selectEntities;

// select the array of Accounts
export const selectAllAccounts = selectAll;

// select the total Accounts count
export const selectAccountsTotal = selectTotal;
