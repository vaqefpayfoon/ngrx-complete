import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducer';
import * as fromReservations from '../reducer/reservations.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IReservations } from '../../models';

export const getReservationState = createSelector(
  fromFeature.getReservationsState,
  (state: fromFeature.IReservationsState) => state.reservations
);

export const getReservationsUuids = createSelector(
  getReservationState,
  fromReservations.selectReservationsUuids
);

export const getReservationsEntities = createSelector(
  getReservationState,
  fromReservations.selectReservationsEntities
);

export const getAllReservations = createSelector(
  getReservationState,
  fromReservations.selectAllReservations
);

export const getSelectedReservation = createSelector(
  getReservationState,
  (state: fromReservations.ReservationsState) => state.selectedReservation
);

export const getReservationsConfig = createSelector(
  getReservationState,
  (state: fromReservations.ReservationsState) => state.pagination
);

export const getReservationsPage = createSelector(
  getReservationsConfig,
  (pagination): IReservations.IConfig => {
    return pagination;
  }
);

export const getReservationsTotals = createSelector(
  getReservationState,
  fromReservations.selectReservationsTotal
);

export const getReservationsTotal = createSelector(
  getReservationState,
  (state: fromReservations.ReservationsState) => state.total
);

export const getReservationsLoaded = createSelector(
  getReservationState,
  (state: fromReservations.ReservationsState) => state.loaded
);

export const getReservationsLoading = createSelector(
  getReservationState,
  (state: fromReservations.ReservationsState) => state.loading
);

export const getReservationsError = createSelector(
  getReservationState,
  (state: fromReservations.ReservationsState) => state.error
);

export const reservtionsQuery = {
  getReservationState,
  getReservationsUuids,
  getReservationsEntities,
  getAllReservations,
  getSelectedReservation,
  getReservationsConfig,
  getReservationsPage,
  getReservationsTotals,
  getReservationsTotal,
  getReservationsLoaded,
  getReservationsLoading,
  getReservationsError
};
