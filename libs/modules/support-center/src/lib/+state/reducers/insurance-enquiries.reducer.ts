import { createReducer, on } from '@ngrx/store';

//Store
import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { InsuranceEnquiriesActions } from '../actions';

//Models
import { IInsuranceEnquiries } from '../../models';

import {
  IGlobalFilter,
  IGlobalSort,
  IPagination,
  GlobalPaginationConfig,
} from '@neural/shared/data';

export interface InsuranceEnquiriesState
  extends EntityState<IInsuranceEnquiries.IDocument> {
  total: number;
  filters: IGlobalFilter;
  sorts: IGlobalSort;
  pagination: IPagination;
  selectedInsuranceEnquiry: IInsuranceEnquiries.IDocument;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<IInsuranceEnquiries.IDocument> = createEntityAdapter<
  IInsuranceEnquiries.IDocument
>({
  selectId: (insuranceEnquiry) => insuranceEnquiry.uuid,
});

export const initialState: InsuranceEnquiriesState = adapter.getInitialState({
  total: 0,
  filters: null,
  sorts: {
    updatedAt: -1,
  },
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
  },
  selectedInsuranceEnquiry: null,
  loaded: false,
  loading: false,
  error: null,
});

const InsuranceEnquiriesReducer = createReducer(
  initialState,

  on(
    InsuranceEnquiriesActions.SetInsuranceEnquiriesPage,
    (state, { payload }) => {
      const { page, limit } = payload;
      return adapter.removeAll({
        ...initialState,
        pagination: {
          ...state.pagination,
          page,
          limit,
        },
        filters: {},
      });
    }
  ),

  on(
    InsuranceEnquiriesActions.ChangeInsuranceEnquiriesPage,
    (state, { payload }) => {
      const { page, limit } = payload;
      return {
        ...state,
        pagination: {
          ...state.pagination,
          page,
          limit,
        },
      };
    }
  ),

  on(
    InsuranceEnquiriesActions.SetInsuranceEnquiriesFilters,
    (state, { payload }) => {
      const filters = payload;
      return {
        ...state,
        pagination: {
          limit: GlobalPaginationConfig.LIMIT,
          page: 1,
          pages: 1,
        },
        filters,
      };
    }
  ),

  on(InsuranceEnquiriesActions.LoadInsuranceEnquiries, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),

  on(
    InsuranceEnquiriesActions.LoadInsuranceEnquiriesFail,
    (state, { payload }) => {
      const error = payload;

      return adapter.removeAll({
        ...initialState,
        filters: state.filters,
        error,
      });
    }
  ),

  on(
    InsuranceEnquiriesActions.LoadInsuranceEnquiriesSuccess,
    (state, { insuranceEnquiries, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.setAll(insuranceEnquiries, {
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
    InsuranceEnquiriesActions.UpdateInsuranceEnquirySuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(
    InsuranceEnquiriesActions.GetInsuranceEnquirySuccess,
    (state, { payload }) =>
      adapter.upsertOne(payload, {
        ...state,
        selectedInsuranceEnquiry: payload,
        error: null,
      })
  ),

  on(InsuranceEnquiriesActions.ResetSelectedInsuranceEnquiry, (state) => {
    return {
      ...state,
      selectedInsuranceEnquiry: null,
    };
  })
);

export function reducer(
  state: InsuranceEnquiriesState | undefined,
  action: InsuranceEnquiriesActions.InsuranceEnquiriesActionsUnion
) {
  return InsuranceEnquiriesReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Insurance Enquiries uuids
export const selectInsuranceEnquiriesUuids = selectIds;

// select the dictionary of Insurance Enquiries entities
export const selectInsuranceEnquiriesEntities = selectEntities;

// select the array of Insurance Enquiries
export const selectAllInsuranceEnquiries = selectAll;

// select the total Insurance Enquiries count
export const selectInsuranceEnquiriesTotal = selectTotal;
