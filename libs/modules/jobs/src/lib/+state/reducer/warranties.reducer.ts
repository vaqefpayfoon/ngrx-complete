import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { WarrantiesActions } from '../actions';

import { IWarranties } from '../../models';

export interface WarrantiesState extends EntityState<IWarranties.IDocument> {
  total: number;
  vehicle: IWarranties.IDocumentVin;
  reports: {
    warranties: IWarranties.IJob | null;
  };
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  selectedWarranty: IWarranties.IDocument;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<IWarranties.IDocument> = createEntityAdapter<
  IWarranties.IDocument
>({
  selectId: (reseravtion) => reseravtion.uuid,
});

export const initialState: WarrantiesState = adapter.getInitialState({
  total: 0,
  reports: null,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
  },
  vehicle: null,
  selectedWarranty: null,
  loaded: false,
  loading: false,
  error: null,
});

const warrantyReducer = createReducer(
  initialState,

  on(WarrantiesActions.SetWarrantiesPage, (state, { payload }) => {
    const { page, limit, statusFilter } = payload;
    return {
      ...state,
      error: null,
      pagination: {
        ...state.pagination,
        statusFilter,
        page,
        limit,
      },
    };
  }),

  on(WarrantiesActions.LoadWarranties, (state) => {
    return adapter.removeAll({
      ...state,
      loading: true,
      loaded: false,
      error: null,
    });
  }),

  on(
    WarrantiesActions.LoadWarrantiesSuccess,
    (state, { warranties, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.setAll(warranties, {
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

  on(WarrantiesActions.LoadAccountsByVin, (state) => {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),

  on(WarrantiesActions.LoadAccountsByVinSuccess, (state, { payload }) => {
    const vehicle = payload;
    return {
      ...state,
      vehicle,
      loading: false,
      error: null,
    };
  }),

  on(
    WarrantiesActions.LoadWarrantiesFail,
    WarrantiesActions.LoadAccountsByVinFail,
    WarrantiesActions.CreateWarrantyFail,
    WarrantiesActions.GetWarrantyFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loaded: false, loading: false, error, vehicle: null };
    }
  ),

  on(WarrantiesActions.GetWarrantySuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedWarranty: payload,
      error: null,
    })
  ),

  on(WarrantiesActions.ResetAccountsByVinSuccess, (state) => {
    return { ...state, vehicle: null };
  }),

  on(WarrantiesActions.ResetSelectedWarranty, (state) => {
    return {
      ...state,
      selectedWarranty: null,
    };
  }),

  on(WarrantiesActions.CloseWarrantySuccess, (state, { payload }) => {
    return adapter.removeOne(payload.uuid, {
      ...state,
      total: state.total - 1,
      loading: false,
      loaded: true,
      error: null,
    });
  }),

  on(WarrantiesActions.GetWarrantyReminderReport, (state) => {
    return {
      ...state,
      reports: {
        ...state.reports,
        jobs: null,
      },
    };
  }),

  on(
    WarrantiesActions.GetWarrantyReminderReportSuccess,
    (state, { payload }) => {
      const { warranties } = payload;

      return {
        ...state,
        loaded: false,
        loading: false,
        reports: {
          ...state.reports,
          warranties,
        },
      };
    }
  )
);

export function reducer(
  state: WarrantiesState | undefined,
  action: WarrantiesActions.WarrantiesActionsUnion
) {
  return warrantyReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Warranties uuids
export const selectWarrantiesUuids = selectIds;

// select the dictionary of Warranties entities
export const selectWarrantiesEntities = selectEntities;

// select the array of Warranties
export const selectAllWarranties = selectAll;

// select the total Warranties count
export const selectWarrantiesTotal = selectTotal;
