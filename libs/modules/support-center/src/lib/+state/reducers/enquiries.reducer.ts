import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { EnquiriesActions } from '../actions';

import { IEnquiries } from '../../models';

export interface EnquiriesState extends EntityState<IEnquiries.IDocument> {
  total: number;
  filters: IEnquiries.IFilter;
  sorts: IEnquiries.ISort;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  selectedEnquiry: IEnquiries.IDocument;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<IEnquiries.IDocument> = createEntityAdapter<
  IEnquiries.IDocument
>({
  selectId: (enquiry) => enquiry.uuid,
});

export const initialState: EnquiriesState = adapter.getInitialState({
  total: 0,
  filters: null,
  sorts: {
    updatedAt: -1
  },
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
  },
  selectedEnquiry: null,
  loaded: false,
  loading: false,
  error: null,
});

const EnquiriesReducer = createReducer(
  initialState,

  on(EnquiriesActions.SetEnquiriesPage, (state, { payload }) => {
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

  on(EnquiriesActions.ChangeEnquiriesPage, (state, { payload }) => {
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

  on(EnquiriesActions.SetEnquiriesFilters, (state, { payload }) => {
    const filters = payload;
    return {
      ...state,
      pagination: {
        limit: IEnquiries.Config.LIMIT,
        page: 1,
        pages: 1,
      },
      filters: {
        ...state.filters,
        ...filters,
      },
    };
  }),

  on(EnquiriesActions.LoadEnquiries, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),

  on(
    EnquiriesActions.GetEnquiryFail,
    EnquiriesActions.UpdateEnquiryFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loading: false, loaded: false, error };
    }
  ),

  on(EnquiriesActions.LoadEnquiriesFail, (state, { payload }) => {
    const error = payload;

    return adapter.removeAll({
      ...initialState,
      filters: state.filters,
      error,
    });
  }),

  on(
    EnquiriesActions.LoadEnquiriesSuccess,
    (state, { enquiries, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.setAll(enquiries, {
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
    EnquiriesActions.UpdateEnquirySuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(EnquiriesActions.GetEnquirySuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedEnquiry: payload,
      error: null,
    })
  ),

  on(EnquiriesActions.ResetSelectedEnquiry, (state) => {
    return {
      ...state,
      selectedEnquiry: null,
    };
  }),
);

export function reducer(
  state: EnquiriesState | undefined,
  action: EnquiriesActions.EnquiriesActionsUnion
) {
  return EnquiriesReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Enquiries uuids
export const selectEnquiriesUuids = selectIds;

// select the dictionary of Enquiries entities
export const selectEnquiriesEntities = selectEntities;

// select the array of Enquiries
export const selectAllEnquiries = selectAll;

// select the total Enquiries count
export const selectEnquiriesTotal = selectTotal;
