import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { InsurerActions } from '../actions';

import { IInsurer } from '../../models';
import {
  IError,
  IGlobalFilter,
  IGlobalSort,
  IPagination,
  GlobalPaginationConfig,
} from '@neural/shared/data';

export interface InsurersState extends EntityState<IInsurer.IDocument> {
  total: number;
  filters: IGlobalFilter | null;
  sorts: IGlobalSort | null;
  pagination: IPagination;
  loaded: boolean;
  loading: boolean;
  error: IError | null;
}

export const adapter: EntityAdapter<IInsurer.IDocument> = createEntityAdapter<
  IInsurer.IDocument
>({
  selectId: (promotion) => promotion.uuid,
});

export const initialState: InsurersState = adapter.getInitialState({
  total: 0,
  sorts: {
    updatedAt: -1,
  },
  filters: null,
  pagination: {
    limit: GlobalPaginationConfig.LIMIT,
    page: 1,
    pages: 1,
  },
  loaded: false,
  loading: false,
  error: null,
});

const insurerReducer = createReducer(
  initialState,

  on(InsurerActions.SetInsurersPage, (_, { payload }) => {
    const { page, limit } = payload;
    return adapter.removeAll({
      ...initialState,
      pagination: {
        ...initialState.pagination,
        page,
        limit,
      },
    });
  }),

  on(InsurerActions.ResetInsurer, (_) => {
    return adapter.removeAll({
      ...initialState,
    });
  }),

  on(InsurerActions.ChangeInsurersPage, (state, { payload }) => {
    const { page, limit } = payload;
    return {
      ...state,
      pagination: {
        ...state.pagination,
        page,
        limit,
      },
    };
  }),

  on(InsurerActions.SetInsurersFilters, (state, { payload }) => {
    const filters = payload;
    return {
      ...state,
      pagination: {
        limit: GlobalPaginationConfig.LIMIT,
        page: 1,
        pages: 1,
      },
      filters: {
        ...state.filters,
        ...filters,
      },
    };
  }),

  on(InsurerActions.LoadInsurers, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),

  on(
    InsurerActions.LoadInsurersFail,
    InsurerActions.CreateInsurerFail,
    InsurerActions.UpdateInsurerFail,
    InsurerActions.GetInsurerFail,
    InsurerActions.ActivateInsurerFail,
    InsurerActions.DeactivateInsurerFail,
    InsurerActions.DeleteInsurerFail,
    (state, { payload }) => {
      const error = payload;

      return adapter.removeAll({
        ...state,
        loading: false,
        loaded: false,
        total: 0,
        error,
      });
    }
  ),

  on(InsurerActions.LoadInsurersSuccess, (state, { insurers, pagination }) => {
    const { page, pages, limit, total } = pagination;
    return adapter.setAll(insurers, {
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

  on(InsurerActions.CreateInsurerSuccess, (state, { payload }) =>
    adapter.addOne(payload, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(InsurerActions.UpdateInsurerSuccess, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(InsurerActions.DeleteInsurerSuccess, (state, { payload }) =>
    adapter.removeOne(payload.uuid, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    InsurerActions.ActivateInsurersSuccess,
    InsurerActions.DeactivateInsurerSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(InsurerActions.ResetInsurerStatus, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(InsurerActions.DeleteInsurerSuccess, (state, { payload }) =>
    adapter.removeOne(payload.uuid, {
      ...state,
      loading: false,
      error: null,
    })
  )
);

export function reducer(
  state: InsurersState | undefined,
  action: InsurerActions.InsurersActionsUnion
): InsurersState {
  return insurerReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Insurers uuids
export const selectInsurersUuids = selectIds;

// select the dictionary of Insurers entities
export const selectInsurersEntities = selectEntities;

// select the array of Insurers
export const selectAllInsurers = selectAll;

// select the total Insurers count
export const selectInsurersTotal = selectTotal;
