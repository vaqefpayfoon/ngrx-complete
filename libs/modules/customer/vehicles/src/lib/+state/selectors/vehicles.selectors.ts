import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromVehicles from '../reducers/vehicles.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IVehicle } from '../../models';

export const getVehiclesState = createSelector(
  fromFeature.getCorporateVehiclesState,
  (state: fromFeature.IVehiclesState) => state.vehicles
);

export const getVehiclesUuids = createSelector(
  getVehiclesState,
  fromVehicles.selectVehiclesUuids
);

export const getVehiclesEntities = createSelector(
  getVehiclesState,
  fromVehicles.selectVehiclesEntities
);

export const getAllVehicles = createSelector(
  getVehiclesState,
  fromVehicles.selectAllVehicles
);

export const getVehiclesTotal = createSelector(
  getVehiclesState,
  (state: fromVehicles.VehiclesState) => state.total
);

export const getVehiclesConfig = createSelector(
  getVehiclesState,
  (state: fromVehicles.VehiclesState) => state.pagination
);

export const getVehiclesFilter = createSelector(
  getVehiclesState,
  (state: fromVehicles.VehiclesState) => state.filter
);

export const getVehiclesSort = createSelector(
  getVehiclesState,
  (state: fromVehicles.VehiclesState) => state.sort
);

export const getTyreList = createSelector(
  getVehiclesState,
  (state: fromVehicles.VehiclesState) => state.tyre
);

export const getRearTyreList = createSelector(
  getVehiclesState,
  (state: fromVehicles.VehiclesState) => state.rearTyre
)

export const getTyreWidths = createSelector(
  getTyreList,
  tyre => tyre.widths
);

export const getVehiclesPage = createSelector(
  getVehiclesConfig,
  getVehiclesFilter,
  getVehiclesSort,
  (pagination, filter, sort): IVehicle.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page, filter, sort }
      : { limit: 10, page: 1, filter: null, sort: null };
  }
);

export const getVehiclesType = createSelector(
  fromRoot.getRouterState,
  router => {
    return router && router.state ? router.state.data.type : null;
  }
);

export const getVehicleList = createSelector(
  getVehiclesState,
  (state: fromVehicles.VehiclesState) =>
    state.list
);

export const getSelectedVehicleUuid = createSelector(
  getVehiclesState,
  (state: fromVehicles.VehiclesState) => state.selectedVehicleUuid
);

export const getSelectedVehicle = createSelector(
  getVehiclesState,
  (state: fromVehicles.VehiclesState) => state.selectedVehicle
);

export const getSearchedVehicle = createSelector(
  getVehiclesState,
  (state: fromVehicles.VehiclesState) => state.searchedVehicle
);

export const getVehiclesLoaded = createSelector(
  getVehiclesState,
  (state: fromVehicles.VehiclesState) => state.loaded
);

export const getVehicleLoaded = createSelector(
  getVehiclesState,
  (state: fromVehicles.VehiclesState) => state.vehicleloaded
);

export const getVehiclesLoading = createSelector(
  getVehiclesState,
  (state: fromVehicles.VehiclesState) => state.loading
);

export const getVehiclesError = createSelector(
  getVehiclesState,
  (state: fromVehicles.VehiclesState) => state.error
);

export const vehiclesQuery = {
  getVehiclesState,
  getVehiclesType,
  getVehiclesUuids,
  getVehiclesEntities,
  getAllVehicles,
  getVehicleList,
  getVehiclesTotal,
  getVehiclesConfig,
  getVehiclesFilter,
  getVehiclesSort,
  getVehiclesPage,
  getTyreList,
  getRearTyreList,
  getTyreWidths,
  getSelectedVehicleUuid,
  getSelectedVehicle,
  getSearchedVehicle,
  getVehiclesLoaded,
  getVehicleLoaded,
  getVehiclesLoading,
  getVehiclesError
};
