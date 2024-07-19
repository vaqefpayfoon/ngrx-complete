import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { InboxMessagesActions } from '../actions';

import { IInboxMessages } from '../../models';
import { Auth } from '@neural/auth';
import { IAccount } from '@neural/modules/administration';
import { IVehicle } from '@neural/modules/customer/vehicles';

export interface InboxMessagesState
  extends EntityState<IInboxMessages.IDocument> {
  total: number;
  filterAccount: IInboxMessages.IFilter;
  filters: IInboxMessages.IFilter;
  accounts: { [uuid: string]: Auth.IAccount };
  vehicles: { [uuid: string]: IVehicle.IDocument },
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<IInboxMessages.IDocument> = createEntityAdapter<
  IInboxMessages.IDocument
>({
  selectId: (inboxMessage) => inboxMessage.uuid,
});

export const initialState: InboxMessagesState = adapter.getInitialState({
  total: 0,
  filterAccount: null,
  accounts: null,
  filters: null,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
  },
  loaded: false,
  loading: false,
  error: null,
  vehicles: null,
});

const inboxMessagesReducer = createReducer(
  initialState,

  on(InboxMessagesActions.SetInboxMessagesPage, (state, { payload }) => {
    const { page, limit } = payload;
    return adapter.removeAll({
      ...state,
      accounts: null,
      pagination: {
        ...state.pagination,
        page,
        limit,
      },
    });
  }),

  on(InboxMessagesActions.ResetFilters, (state) => {
    return {
      ...state,
      accounts: [],
      vehicles: null,
      loading: false,
      loaded: true,
      error: null,
    };
  }),

  on(InboxMessagesActions.LoadInboxMessages, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
      accounts: [],
      vehicles: null,
    };
  }),

  on(InboxMessagesActions.LoadInboxMessagesFail, (state, { payload }) => {
    const error = payload;

    return { ...state, loading: false, loaded: false, error };
  }),

  on(
    InboxMessagesActions.LoadInboxMessagesSuccess,
    (state, { inboxMessages, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.setAll(inboxMessages, {
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
        accounts: [],
        vehicles: null

      });
    }
  ),

  on(InboxMessagesActions.CreateInboxMessageSuccess, (state, { payload }) =>
    adapter.addOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    })
  ),

  on(InboxMessagesActions.SetInboxMessagesFilters, (state, { payload }) => {
    const filters = payload;
    return {
      ...state,
      pagination: {
        limit: IInboxMessages.Config.LIMIT,
        page: 1,
        pages: 1,
      },
      filters,
    };
  }),

  on(InboxMessagesActions.LoadInboxMessagesFail, (state, { payload }) => {
    const error = payload;

    return adapter.removeAll({
      ...initialState,
      filters: state.filters,
      error,
    });
  }),

  on(InboxMessagesActions.GetInboxAccountsSuccess, (state, { payload }) => {
    const accounts = payload.reduce(
      (entries: { [uuid: string]: Auth.IAccount }, account: Auth.IAccount) => {
        return {
          ...entries,
          [account.uuid]: account,
        };
      },
      { ...state.accounts }
    );

    return {
      ...state,
      accounts,
      loading: false,
      loaded: true,
      error: null,
    };
  }),

  on(InboxMessagesActions.LoadVehiclesSuccess, (state, { payload }) => {
    const vehicles = payload.reduce(
      (entries: { [uuid: string]: IVehicle.IDocument }, vehicle: IVehicle.IDocument) => {
        return {
          ...entries,
          [vehicle.uuid]: vehicle,
        };
      },
      { ...state.vehicles }
    );

    return {
      ...state,
      vehicles,
      loading: false,
      loaded: true,
      error: null,
    };
  }),

);

export function reducer(
  state: InboxMessagesState | undefined,
  action: InboxMessagesActions.InboxMessagesActionsUnion
) {
  return inboxMessagesReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of InboxMessages uuids
export const selectInboxMessagesUuids = selectIds;

// select the dictionary of InboxMessages entities
export const selectInboxMessagesEntities = selectEntities;

// select the array of InboxMessages
export const selectAllInboxMessages = selectAll;

// select the total InboxMessages count
export const selectInboxMessagesTotal = selectTotal;
