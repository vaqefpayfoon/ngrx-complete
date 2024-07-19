import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromEnquiries from '../reducers/enquiries.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IEnquiries } from '../../models';

export const getEnquiriesState = createSelector(
  fromFeature.getSupportCenterState,
  (state: fromFeature.ISupportCenter) => state.enquiries
);

export const getEnquiriesEntities = createSelector(
  getEnquiriesState,
  fromEnquiries.selectEnquiriesEntities
);

export const getEnquiriesUuids = createSelector(
  getEnquiriesState,
  fromEnquiries.selectEnquiriesUuids
);

export const getAllEnquiries = createSelector(
  getEnquiriesState,
  fromEnquiries.selectAllEnquiries
);

export const getEnquiriesTotals = createSelector(
  getEnquiriesState,
  fromEnquiries.selectEnquiriesTotal
);

export const getEnquiriesTotal = createSelector(
  getEnquiriesState,
  (state: fromEnquiries.EnquiriesState) => state.total
);

export const getEnquiriesConfig = createSelector(
  getEnquiriesState,
  (state: fromEnquiries.EnquiriesState) => state.pagination
);

export const getEnquiriesFilters = createSelector(
  getEnquiriesState,
  (state: fromEnquiries.EnquiriesState) => state.filters
);

export const getEnquiriesPage = createSelector(
  getEnquiriesConfig,
  (pagination): IEnquiries.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getSelectedEnquiry = createSelector(
  getEnquiriesState,
  (state: fromEnquiries.EnquiriesState) => state.selectedEnquiry
);

export const getEnquiriesLoaded = createSelector(
  getEnquiriesState,
  (state: fromEnquiries.EnquiriesState) => state.loaded
);

export const getEnquiriesLoading = createSelector(
  getEnquiriesState,
  (state: fromEnquiries.EnquiriesState) => state.loading
);

export const getEnquiriesError = createSelector(
  getEnquiriesState,
  (state: fromEnquiries.EnquiriesState) => state.error
);

export const getEnquiriesSorts = createSelector(
  getEnquiriesState,
  (state: fromEnquiries.EnquiriesState) => state.sorts
);

export const enquiriesQuery = {
  getEnquiriesUuids,
  getEnquiriesEntities,
  getAllEnquiries,
  getEnquiriesTotal,
  getEnquiriesTotals,
  getEnquiriesConfig,
  getEnquiriesPage,
  getSelectedEnquiry,
  getEnquiriesLoaded,
  getEnquiriesLoading,
  getEnquiriesError,
  getEnquiriesFilters,
  getEnquiriesSorts
};
