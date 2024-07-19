import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromFleets from '../reducers/fleet.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IFleet } from '../../models';

export const getFleetsState = createSelector(
  fromFeature.getFleetState,
  (state: fromFeature.IFleetState) => state.fleets
);

export const getFleetsUuids = createSelector(
  getFleetsState,
  fromFleets.selectFleetsUuids
);

export const getFleetsEntities = createSelector(
  getFleetsState,
  fromFleets.selectFleetsEntities
);

export const getAllFleets = createSelector(
  getFleetsState,
  fromFleets.selectAllFleets
);

export const getSelectedFleet = createSelector(
  getFleetsState,
  (state: fromFleets.FleetState) => state.selectedFleet
);

export const getFleetsConfig = createSelector(
  getFleetsState,
  (state: fromFleets.FleetState) => state.pagination
);

export const getFleetsPage = createSelector(
  getFleetsConfig,
  (pagination): IFleet.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getFleetsTotals = createSelector(
  getFleetsState,
  fromFleets.selectFleetsTotal
);

export const getFleetsTotal = createSelector(
  getFleetsState,
  (state: fromFleets.FleetState) => state.total
);

export const getFleetsLoaded = createSelector(
  getFleetsState,
  (state: fromFleets.FleetState) => state.loaded
);

export const getFleetsLoading = createSelector(
  getFleetsState,
  (state: fromFleets.FleetState) => state.loading
);

export const getFleetsError = createSelector(
  getFleetsState,
  (state: fromFleets.FleetState) => state.error
);

export const fleetsQuery = {
  getFleetsState,
  getFleetsUuids,
  getFleetsEntities,
  getAllFleets,
  getSelectedFleet,
  getFleetsTotals,
  getFleetsTotal,
  getFleetsConfig,
  getFleetsPage,
  getFleetsLoaded,
  getFleetsLoading,
  getFleetsError
};
