import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromVehicleReferences from '../reducers/vehicle-reference.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IVehicleReference } from '../../models';

export const getVehicleReferencesState = createSelector(
  fromFeature.getCorporateVehiclesState,
  (state: fromFeature.IVehiclesState) => state.vehicleReferences
);

export const getVehicleReferencesUuids = createSelector(
  getVehicleReferencesState,
  fromVehicleReferences.selectVehicleReferencesUuids
);

export const getVehicleReferencesEntities = createSelector(
  getVehicleReferencesState,
  fromVehicleReferences.selectVehicleReferencesEntities
);

export const getAllVehicleReferences = createSelector(
  getVehicleReferencesState,
  fromVehicleReferences.selectAllVehicleReferences
);

export const getVehicleReferencesTotal = createSelector(
  getVehicleReferencesState,
  (state: fromVehicleReferences.VehiclesReferenceState) => state.total
);

export const getVehicleReferencesConfig = createSelector(
  getVehicleReferencesState,
  (state: fromVehicleReferences.VehiclesReferenceState) => state.pagination
);

export const getVehicleReferencesFilter = createSelector(
  getVehicleReferencesState,
  (state: fromVehicleReferences.VehiclesReferenceState) => state.filter
);

export const getVehicleReferencesSort = createSelector(
  getVehicleReferencesState,
  (state: fromVehicleReferences.VehiclesReferenceState) => state.sort
);

export const getVehicleReferencesPage = createSelector(
  getVehicleReferencesConfig,
  getVehicleReferencesFilter,
  getVehicleReferencesSort,
  (pagination, filter, sort): IVehicleReference.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page, filter, sort }
      : { limit: 10, page: 1, filter: null, sort: null };
  }
);

export const getVehicleReferenceList = createSelector(
  getVehicleReferencesState,
  (state: fromVehicleReferences.VehiclesReferenceState) =>
    state.list
);

export const getSelectedVehicleReference = createSelector(
  getVehicleReferencesState,
  (state: fromVehicleReferences.VehiclesReferenceState) => state.selectedVehicleReference
);

export const getVehicleReferencesLoaded = createSelector(
  getVehicleReferencesState,
  (state: fromVehicleReferences.VehiclesReferenceState) => state.loaded
);

export const getVehicleReferencesLoading = createSelector(
  getVehicleReferencesState,
  (state: fromVehicleReferences.VehiclesReferenceState) => state.loading
);

export const getVehicleReferencesError = createSelector(
  getVehicleReferencesState,
  (state: fromVehicleReferences.VehiclesReferenceState) => state.error
);

export const vehicleReferencesQuery = {
  getVehicleReferencesState,
  getVehicleReferencesUuids,
  getVehicleReferenceList,
  getVehicleReferencesEntities,
  getAllVehicleReferences,
  getVehicleReferencesTotal,
  getVehicleReferencesConfig,
  getVehicleReferencesFilter,
  getVehicleReferencesSort,
  getVehicleReferencesPage,
  getSelectedVehicleReference,
  getVehicleReferencesLoaded,
  getVehicleReferencesLoading,
  getVehicleReferencesError
};
