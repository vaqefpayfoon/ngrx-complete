import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducer';
import * as fromManualReservations from '../reducer/manual-reservation.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IManualReservations } from '../../models';

export const getManualReservationsState = createSelector(
  fromFeature.getReservationsState,
  (state: fromFeature.IReservationsState) => state.manualReservation
);

export const getManualReservationsEntities = createSelector(
  getManualReservationsState,
  fromManualReservations.selectManualReservationsEntities
);

export const getManualReservationsUuids = createSelector(
  getManualReservationsState,
  fromManualReservations.selectManualReservationsUuids
);

export const getAllManualReservations = createSelector(
  getManualReservationsState,
  fromManualReservations.selectAllManualReservations
);

export const getManualReservationsTotals = createSelector(
  getManualReservationsState,
  fromManualReservations.selectManualReservationsTotal
);

export const getManualReservationsTotal = createSelector(
  getManualReservationsState,
  (state: fromManualReservations.ManualReservationState) => state.total
);

export const getManualReservationsConfig = createSelector(
  getManualReservationsState,
  (state: fromManualReservations.ManualReservationState) => state.pagination
);

export const getManualReservationsFilter = createSelector(
  getManualReservationsState,
  (state: fromManualReservations.ManualReservationState) => state.filters
);

export const getManualReservationsPage = createSelector(
  getManualReservationsConfig,
  (pagination): IManualReservations.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getSelectedManualReservation = createSelector(
  getManualReservationsEntities,
  fromRoot.getRouterState,
  (entities, router): IManualReservations.IDocument =>
    entities ? router.state && entities[router.state.params.uuid] : null
);

export const getManualReservationsLoaded = createSelector(
  getManualReservationsState,
  (state: fromManualReservations.ManualReservationState) => state.loaded
);

export const dmsVehiclesLoaded = createSelector(
  getManualReservationsState,
  (state: fromManualReservations.ManualReservationState) =>
    state.loadedDmsVehicles
);

export const dmsCustomersLoading = createSelector(
  getManualReservationsState,
  (state: fromManualReservations.ManualReservationState) =>
    state.loadingDmsCustomers
);

export const dmsVehiclesLoading = createSelector(
  getManualReservationsState,
  (state: fromManualReservations.ManualReservationState) =>
    state.loadingDmsVehicles
);

export const getManualReservationsLoading = createSelector(
  getManualReservationsState,
  (state: fromManualReservations.ManualReservationState) => state.loading
);

export const getManualReservationsError = createSelector(
  getManualReservationsState,
  (state: fromManualReservations.ManualReservationState) => state.error
);

export const getSelectedSlot = createSelector(
  getManualReservationsState,
  (state: fromManualReservations.ManualReservationState) => state.selectedSlot
);

export const getSelectedDay = createSelector(
  getManualReservationsState,
  (state: fromManualReservations.ManualReservationState) => state.selectedDay
);

export const getOperations = createSelector(
  getManualReservationsState,
  (state: fromManualReservations.ManualReservationState) => state.operations
);

export const getDmsCustomers = createSelector(
  getManualReservationsState,
  (state: fromManualReservations.ManualReservationState) => state.dmsCustomers
);

export const getDmsVehicles = createSelector(
  getManualReservationsState,
  (state: fromManualReservations.ManualReservationState) => state.dmsVehicles
);

export const getVehicleMakes = createSelector(
  getManualReservationsState,
  (state: fromManualReservations.ManualReservationState) => state.vehicleMakes
);

export const getVehicleModels = createSelector(
  getManualReservationsState,
  (state: fromManualReservations.ManualReservationState) => state.vehicleModels
);

export const getVehicleYearMakes = createSelector(
  getManualReservationsState,
  (state: fromManualReservations.ManualReservationState) => state.yearMakes
);

export const manualReservationQuery = {
  getManualReservationsState,
  getManualReservationsEntities,
  getManualReservationsUuids,
  getAllManualReservations,
  getManualReservationsTotals,
  getManualReservationsTotal,
  getManualReservationsConfig,
  getManualReservationsPage,
  getSelectedManualReservation,
  getManualReservationsLoaded,
  getManualReservationsLoading,
  getManualReservationsError,
  getManualReservationsFilter,
  getSelectedSlot,
  getSelectedDay,
  getOperations,
  getDmsCustomers,
  getDmsVehicles,
  dmsVehiclesLoaded,
  dmsCustomersLoading,
  dmsVehiclesLoading,
  getVehicleMakes,
  getVehicleModels,
  getVehicleYearMakes,
};
