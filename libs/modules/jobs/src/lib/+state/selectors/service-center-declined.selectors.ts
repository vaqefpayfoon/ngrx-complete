import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducer';
import * as fromServiceCenterDeclined from '../reducer/service-center-declined.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IReservations } from '../../models';

export const getServiceCenterDeclinedState = createSelector(
  fromFeature.getReservationsState,
  (state: fromFeature.IReservationsState) => state.serviceCenterDeclined
);

export const getServiceCenterDeclinedUuids = createSelector(
  getServiceCenterDeclinedState,
  fromServiceCenterDeclined.selectServiceCenterDeclinedUuids
);

export const getServiceCenterDeclinedEntities = createSelector(
  getServiceCenterDeclinedState,
  fromServiceCenterDeclined.selectServiceCenterDeclinedEntities
);

export const getAllServiceCenterDeclined = createSelector(
  getServiceCenterDeclinedState,
  fromServiceCenterDeclined.selectAllServiceCenterDeclined
);

export const getSelectedServiceCenterDeclined = createSelector(
  getServiceCenterDeclinedState,
  (state: fromServiceCenterDeclined.ServiceCenterDeclinedState) => state.selectedDeclined 
);

export const getServiceCenterDeclinedConfig = createSelector(
  getServiceCenterDeclinedState,
  (state: fromServiceCenterDeclined.ServiceCenterDeclinedState) => state.pagination
);

export const getServiceCenterDeclinedPage = createSelector(
  getServiceCenterDeclinedConfig,
  (pagination): IReservations.IConfig => {
    return pagination;
  }
);

export const getServiceCenterDeclinedTotals = createSelector(
  getServiceCenterDeclinedState,
  fromServiceCenterDeclined.selectServiceCenterDeclinedTotal
);

export const getServiceCenterDeclinedTotal = createSelector(
  getServiceCenterDeclinedState,
  (state: fromServiceCenterDeclined.ServiceCenterDeclinedState) => state.total
);

export const getServiceCenterDeclinedLoaded = createSelector(
  getServiceCenterDeclinedState,
  (state: fromServiceCenterDeclined.ServiceCenterDeclinedState) => state.loaded
);

export const getServiceCenterDeclinedLoading = createSelector(
  getServiceCenterDeclinedState,
  (state: fromServiceCenterDeclined.ServiceCenterDeclinedState) => state.loading
);

export const getServiceCenterDeclinedError = createSelector(
  getServiceCenterDeclinedState,
  (state: fromServiceCenterDeclined.ServiceCenterDeclinedState) => state.error
);

export const serviceCenterDeclinedQuery = {
    getServiceCenterDeclinedState,
    getServiceCenterDeclinedUuids,
    getServiceCenterDeclinedEntities,
    getAllServiceCenterDeclined,
    getSelectedServiceCenterDeclined,
    getServiceCenterDeclinedConfig,
    getServiceCenterDeclinedPage,
    getServiceCenterDeclinedTotals,
    getServiceCenterDeclinedTotal,
    getServiceCenterDeclinedLoaded,
    getServiceCenterDeclinedLoading,
    getServiceCenterDeclinedError
};
