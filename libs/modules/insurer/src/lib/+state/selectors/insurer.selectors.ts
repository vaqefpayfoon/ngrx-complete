import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromInsurers from '../reducers/insurer.reducer';

import { IGlobalConfig } from '@neural/shared/data';

import * as fromRoot from '@neural/ngrx-router';
import { IInsurer } from '../../models';

export const getInsurersState = createSelector(
  fromFeature.getInsuranceState,
  (state: fromFeature.IInsurerModel) => state.insurers
);

export const getInsurersEntities = createSelector(
  getInsurersState,
  fromInsurers.selectInsurersEntities
);

export const getInsurersUuids = createSelector(
  getInsurersState,
  fromInsurers.selectInsurersUuids
);

export const getAllInsurers = createSelector(
  getInsurersState,
  fromInsurers.selectAllInsurers
);

export const getInsurersTotals = createSelector(
  getInsurersState,
  fromInsurers.selectInsurersTotal
);

export const getInsurersTotal = createSelector(
  getInsurersState,
  (state: fromInsurers.InsurersState) => state.total
);

export const getInsurersConfig = createSelector(
  getInsurersState,
  (state: fromInsurers.InsurersState) => state.pagination
);

export const getInsurersFilters = createSelector(
  getInsurersState,
  (state: fromInsurers.InsurersState) => state.filters
);

export const getInsurersPage = createSelector(
  getInsurersConfig,
  (pagination): IGlobalConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getCorporateUuid = createSelector(
  fromRoot.getRouterState,
  (router) => (router ? router.state && router.state.params.uuid : null)
);

export const getSelectedInsurer = createSelector(
  getInsurersEntities,
  fromRoot.getRouterState,
  (entities, router): IInsurer.IDocument | null | undefined => {
    return entities ? router.state && entities[router.state.params.uuid] : null;
  }
);

export const getInsurersLoaded = createSelector(
  getInsurersState,
  (state: fromInsurers.InsurersState) => state.loaded
);

export const getInsurersLoading = createSelector(
  getInsurersState,
  (state: fromInsurers.InsurersState) => state.loading
);

export const getInsurersError = createSelector(
  getInsurersState,
  (state: fromInsurers.InsurersState) => state.error
);

export const getInsurersSorts = createSelector(
  getInsurersState,
  (state: fromInsurers.InsurersState) => state.sorts
);

export const InsurersQuery = {
  getInsurersUuids,
  getInsurersEntities,
  getAllInsurers,
  getInsurersTotal,
  getInsurersTotals,
  getInsurersConfig,
  getInsurersPage,
  getSelectedInsurer,
  getInsurersLoaded,
  getInsurersLoading,
  getInsurersError,
  getInsurersFilters,
  getInsurersSorts,
  getCorporateUuid,
};
