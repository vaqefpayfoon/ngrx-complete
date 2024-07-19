import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromInsuranceEnquiries from '../reducers/insurance-enquiries.reducer';

import { IGlobalConfig } from '@neural/shared/data';

export const getInsuranceEnquiriesState = createSelector(
  fromFeature.getSupportCenterState,
  (state: fromFeature.ISupportCenter) => state.insuranceEnquiries
);

export const getInsuranceEnquiriesEntities = createSelector(
  getInsuranceEnquiriesState,
  fromInsuranceEnquiries.selectInsuranceEnquiriesEntities
);

export const getInsuranceEnquiriesUuids = createSelector(
  getInsuranceEnquiriesState,
  fromInsuranceEnquiries.selectInsuranceEnquiriesUuids
);

export const getAllInsuranceEnquiries = createSelector(
  getInsuranceEnquiriesState,
  fromInsuranceEnquiries.selectAllInsuranceEnquiries
);

export const getInsuranceEnquiriesTotals = createSelector(
  getInsuranceEnquiriesState,
  fromInsuranceEnquiries.selectInsuranceEnquiriesTotal
);

export const getInsuranceEnquiriesTotal = createSelector(
  getInsuranceEnquiriesState,
  (state: fromInsuranceEnquiries.InsuranceEnquiriesState) => state.total
);

export const getInsuranceEnquiriesConfig = createSelector(
  getInsuranceEnquiriesState,
  (state: fromInsuranceEnquiries.InsuranceEnquiriesState) => state.pagination
);

export const getInsuranceEnquiriesFilters = createSelector(
  getInsuranceEnquiriesState,
  (state: fromInsuranceEnquiries.InsuranceEnquiriesState) => state.filters
);

export const getInsuranceEnquiriesPage = createSelector(
  getInsuranceEnquiriesConfig,
  (pagination): IGlobalConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getSelectedInsuranceEnquiry = createSelector(
  getInsuranceEnquiriesState,
  (state: fromInsuranceEnquiries.InsuranceEnquiriesState) => state.selectedInsuranceEnquiry
);

export const getInsuranceEnquiriesLoaded = createSelector(
  getInsuranceEnquiriesState,
  (state: fromInsuranceEnquiries.InsuranceEnquiriesState) => state.loaded
);

export const getInsuranceEnquiriesLoading = createSelector(
  getInsuranceEnquiriesState,
  (state: fromInsuranceEnquiries.InsuranceEnquiriesState) => state.loading
);

export const getInsuranceEnquiriesError = createSelector(
  getInsuranceEnquiriesState,
  (state: fromInsuranceEnquiries.InsuranceEnquiriesState) => state.error
);

export const getInsuranceEnquiriesSorts = createSelector(
  getInsuranceEnquiriesState,
  (state: fromInsuranceEnquiries.InsuranceEnquiriesState) => state.sorts
);

export const insuranceEnquiriesQuery = {
  getInsuranceEnquiriesUuids,
  getInsuranceEnquiriesEntities,
  getAllInsuranceEnquiries,
  getInsuranceEnquiriesTotal,
  getInsuranceEnquiriesTotals,
  getInsuranceEnquiriesConfig,
  getInsuranceEnquiriesPage,
  getSelectedInsuranceEnquiry,
  getInsuranceEnquiriesLoaded,
  getInsuranceEnquiriesLoading,
  getInsuranceEnquiriesError,
  getInsuranceEnquiriesFilters,
  getInsuranceEnquiriesSorts
};
