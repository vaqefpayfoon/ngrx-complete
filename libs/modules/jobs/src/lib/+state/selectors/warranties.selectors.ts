import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducer';
import * as fromWarranties from '../reducer/warranties.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IWarranties } from '../../models';

export const getWarrantyState = createSelector(
  fromFeature.getReservationsState,
  (state: fromFeature.IReservationsState) => state.warranties
);

export const getWarrantiesUuids = createSelector(
  getWarrantyState,
  fromWarranties.selectWarrantiesUuids
);

export const getWarrantiesEntities = createSelector(
  getWarrantyState,
  fromWarranties.selectWarrantiesEntities
);

export const getAllWarranties = createSelector(
  getWarrantyState,
  fromWarranties.selectAllWarranties
);

export const getAllWarrantiesReports = createSelector(
  getWarrantyState,
  (state: fromWarranties.WarrantiesState) => state.reports
);

export const getSelectedWarranty = createSelector(
  getWarrantyState,
  (state: fromWarranties.WarrantiesState) => state.selectedWarranty
);

export const getWarrantiesConfig = createSelector(
  getWarrantyState,
  (state: fromWarranties.WarrantiesState) => state.pagination
);

export const getWarrantiesPage = createSelector(
  getWarrantiesConfig,
  (pagination): IWarranties.IConfig => {
    return pagination;
  }
);

export const getWarrantiesVehicle = createSelector(
  getWarrantyState,
  (state: fromWarranties.WarrantiesState) => state.vehicle
);

export const getWarrantiesTotals = createSelector(
  getWarrantyState,
  fromWarranties.selectWarrantiesTotal
);

export const getWarrantiesTotal = createSelector(
  getWarrantyState,
  (state: fromWarranties.WarrantiesState) => state.total
);

export const getWarrantiesLoaded = createSelector(
  getWarrantyState,
  (state: fromWarranties.WarrantiesState) => state.loaded
);

export const getWarrantiesLoading = createSelector(
  getWarrantyState,
  (state: fromWarranties.WarrantiesState) => state.loading
);

export const getWarrantiesError = createSelector(
  getWarrantyState,
  (state: fromWarranties.WarrantiesState) => state.error
);

export const warrantyQuery = {
  getWarrantyState,
  getWarrantiesVehicle,
  getWarrantiesUuids,
  getWarrantiesEntities,
  getAllWarranties,
  getSelectedWarranty,
  getWarrantiesConfig,
  getWarrantiesPage,
  getWarrantiesTotals,
  getWarrantiesTotal,
  getWarrantiesLoaded,
  getWarrantiesLoading,
  getWarrantiesError,
  getAllWarrantiesReports
};
