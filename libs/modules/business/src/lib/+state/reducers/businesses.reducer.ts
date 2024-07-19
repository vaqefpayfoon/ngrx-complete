import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { BusinessesActions } from '../actions';

import { IBusinesses } from '../../models';
import { IAccount } from '@neural/modules/administration';

export interface AccountState extends EntityState<IAccount.IDocument> {
  search: IBusinesses.ISearch[] | null;
  pagination: IAccount.IPagination | null;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const accountsAdapter: EntityAdapter<
  IAccount.IDocument
> = createEntityAdapter<IAccount.IDocument>({
  selectId: account => account.uuid
});

export const initialAccountState: AccountState = accountsAdapter.getInitialState(
  {
    search: null,
    pagination: null,
    loaded: false,
    loading: false,
    error: null
  }
);

export interface BusinessState extends EntityState<IBusinesses.IDocument> {
  total: number;
  accounts: IAccount.IDocument[];
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  selectedBusiness: IBusinesses.IDocument;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<
  IBusinesses.IDocument
> = createEntityAdapter<IBusinesses.IDocument>({
  selectId: business => business.uuid
});

export const initialState: BusinessState = adapter.getInitialState({
  total: 0,
  accounts: null,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1
  },
  selectedBusiness: null,
  loaded: false,
  loading: false,
  error: null
});

const businessReducer = createReducer(
  initialState,

  on(BusinessesActions.SetBusinessesPage, (state, { payload }) => {
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
  }),

  on(BusinessesActions.LoadBusinesses, state => {
    return adapter.removeAll({
      ...state,
      loading: true,
      loaded: false,
      error: null
    });
  }),

  on(
    BusinessesActions.LoadBusinessesFail,
    BusinessesActions.ActivateBusinessFail,
    BusinessesActions.DeactivateBusinessFail,
    BusinessesActions.GetBusinessFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loading: false, loaded: false, error };
    }
  ),

  on(BusinessesActions.GetBusinessSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedBusiness: payload,
      error: null,
    })
  ),

  on(
    BusinessesActions.LoadBusinessesSuccess,
    (state, { payload: { businesses, pagination } }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.setAll(businesses, {
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
    BusinessesActions.ActivateBusinessSuccess,
    BusinessesActions.DeactivateBusinessSuccess,
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
    BusinessesActions.CreateBusiness,
    BusinessesActions.UpdateBusiness,
    state => ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(BusinessesActions.CreateBusinessSuccess, (state, { payload }) => {
    return adapter.addOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    });
  }),

  on(BusinessesActions.UpdateBusinessSuccess, (state, { payload }) => {
    return adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    });
  }),

  on(BusinessesActions.ResetBusinessStatus, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      error: null
    })
  ),

  on(BusinessesActions.ResetSelectedBusiness, (state) => {
    return {
      ...state,
      selectedBusiness: null,
    };
  }),
);

const accountReducer = createReducer(
  initialAccountState,

  on(BusinessesActions.SearchAccount, (state, { payload }) => ({
    ...state,
    search: payload,
    loading: true,
    error: null
  })),

  on(BusinessesActions.ChangeAccountsPage, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(BusinessesActions.ResetSearch, () => {
    return accountsAdapter.removeAll({ ...initialAccountState });
  }),

  on(BusinessesActions.SearchAccountSuccess, (state, { payload }) => {
    const {
      accounts,
      pagination: { page, pages, limit, total }
    } = payload;
    return accountsAdapter.addMany(accounts, {
      ...state,
      loading: false,
      pagination: {
        ...state.pagination,
        total,
        page,
        pages,
        limit
      },
      error: null
    });
  })
);

export function reducer(
  state: BusinessState | undefined,
  action: BusinessesActions.BusinessesActionsUnion
) {
  return businessReducer(state, action);
}

export function accountsReducer(
  state: AccountState | undefined,
  action: BusinessesActions.AccountsActionsUnion
) {
  return accountReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

const {
  selectAll: selectAccountsAll,
  selectEntities: selectAccountsEntities,
  selectIds: selectAccountsIds,
  selectTotal: selectAccountsTotal
} = accountsAdapter.getSelectors();

// select the array of Businesses uuids
export const selectBusinessesUuids = selectIds;

// select the dictionary of Businesses entities
export const selectBusinessesEntities = selectEntities;

// select the array of Businesses
export const selectAllBusinesses = selectAll;

// select the total Businesses count
export const selectBusinessesTotal = selectTotal;

// --------------------------------------------

// select the array of Businesses uuids
export const selectUuidsAcccount = selectAccountsIds;

// select the dictionary of Accounts entities
export const selectEntitiesAccounts = selectAccountsEntities;

// select the array of Accounts
export const selectAllAccounts = selectAccountsAll;

// select the total Accounts count
export const selectTotalAccounts = selectAccountsTotal;
