import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { ValuationsActions } from '../actions';

import { IPurchases, ISales } from '../../models';

export interface ValuationsState extends EntityState<IPurchases.IDocument> {
  total: number;
  filters: ISales.IFilter;
  sorts: ISales.ISort;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  selectedValuation: IPurchases.IDocument;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<IPurchases.IDocument> = createEntityAdapter<
  IPurchases.IDocument
>({
  selectId: (sale) => sale.uuid,
});

export const initialState: ValuationsState = adapter.getInitialState({
  total: 0,
  saleAdvisors: null,
  sorts: {
    updatedAt: -1,
  },
  filters: {
    [`payment.status`]: ISales.PaymentStatus.SUCCESS,
  },
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
  },
  selectedValuation: null,
  loaded: false,
  loading: false,
  error: null,
});

const valuationReducer = createReducer(
  initialState,

  on(ValuationsActions.SetValuationsPage, (state, { payload }) => {
    const { page, limit } = payload;
    return adapter.removeAll({
      ...initialState,
      pagination: {
        ...state.pagination,
        page,
        limit,
      },
    });
  }),

  on(ValuationsActions.ChangeValuationsPage, (state, { payload }) => {
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

  on(ValuationsActions.SetValuationsFilters, (state, { payload }) => {
    const filters = payload;
    return {
      ...state,
      pagination: {
        limit: ISales.Config.LIMIT,
        page: 1,
        pages: 1,
      },
      filters: {
        ...state.filters,
        ...filters,
      },
    };
  }),

  on(ValuationsActions.LoadValuations, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),

  on(
    ValuationsActions.GetValuationFail,
    ValuationsActions.UpdateValuationFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loading: false, loaded: false, error };
    }
  ),

  on(ValuationsActions.LoadValuationsFail, (state, { payload }) => {
    const error = payload;

    return adapter.removeAll({
      ...initialState,
      filters: state.filters,
      error,
    });
  }),

  on(
    ValuationsActions.LoadValuationsSuccess,
    (state, { sales, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.setAll(sales, {
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
    }
  ),

  on(
    ValuationsActions.CancelValuationSuccess,
    ValuationsActions.CompleteValuationSuccess,
    ValuationsActions.UpdateValuationSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(ValuationsActions.GetValuationSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedSale: payload,
      error: null,
    })
  ),

  on(ValuationsActions.ResetSelectedValuation, (state) => {
    return {
      ...state,
      selectedSale: null,
    };
  })
);

export function reducer(
  state: ValuationsState | undefined,
  action: ValuationsActions.ValuationsActionsUnion
) {
  return valuationReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Sales uuids
export const selectValuationsUuids = selectIds;

// select the dictionary of Sales entities
export const selectValuationsEntities = selectEntities;

// select the array of Sales
export const selectAllValuations = selectAll;

// select the total Sales count
export const selectValuationsTotal = selectTotal;
