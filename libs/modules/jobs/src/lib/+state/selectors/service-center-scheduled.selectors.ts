import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducer';
import * as fromServiceCenterScheduled from '../reducer/service-center-scheduled.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IReservations } from '../../models';

import { sortByDate } from './completed.selectors';

export const getServiceCenterScheduledState = createSelector(
  fromFeature.getReservationsState,
  (state: fromFeature.IReservationsState) => state.serviceCenterScheduled
);

export const getServiceCenterScheduledUuids = createSelector(
  getServiceCenterScheduledState,
  fromServiceCenterScheduled.selectServiceCenterScheduledUuids
);

export const getServiceCenterScheduledEntities = createSelector(
  getServiceCenterScheduledState,
  fromServiceCenterScheduled.selectServiceCenterScheduledEntities
);

export const getAllServiceCenterScheduled = createSelector(
  getServiceCenterScheduledState,
  fromServiceCenterScheduled.selectAllServiceCenterScheduled
);

export const getServiceCenterScheduledTotal = createSelector(
  getServiceCenterScheduledState,
  (state: fromServiceCenterScheduled.ServiceCenterScheduledState) => state.totals
);

export const getServiceCenterCalendarEntities = createSelector(
  getServiceCenterScheduledState,
  (state: fromServiceCenterScheduled.ServiceCenterScheduledState) =>
    state.calendar
);

export const getServiceCenterCalendarAll = createSelector(
  getServiceCenterCalendarEntities,
  (entities) =>
    entities
      ? Object.keys(entities)
          .map((uuid) => entities[uuid])
          .sort(sortByDate)
      : null
);

export const getAllServicecenterScheduledReports = createSelector(
  getServiceCenterScheduledState,
  (state: fromServiceCenterScheduled.ServiceCenterScheduledState) =>
    state.reports
);

export const getSelectedServiceCenterScheduled = createSelector(
  getServiceCenterScheduledState,
  (state: fromServiceCenterScheduled.ServiceCenterScheduledState) =>
    state.selectedReservation
);

export const getServiceCenterScheduledTotals = createSelector(
  getServiceCenterScheduledState,
  (state: fromServiceCenterScheduled.ServiceCenterScheduledState) => state.totals);

export const getServiceCenterScheduledLoaded = createSelector(
  getServiceCenterScheduledState,
  (state: fromServiceCenterScheduled.ServiceCenterScheduledState) =>
    state.loaded
);

export const getServiceCenterScheduledLoading = createSelector(
  getServiceCenterScheduledState,
  (state: fromServiceCenterScheduled.ServiceCenterScheduledState) =>
    state.loading
);

export const getServiceCenterScheduledError = createSelector(
  getServiceCenterScheduledState,
  (state: fromServiceCenterScheduled.ServiceCenterScheduledState) => state.error
);

export const getServiceCenterScheduledDayList = createSelector(
  getServiceCenterScheduledState,
  (state: fromServiceCenterScheduled.ServiceCenterScheduledState) =>
    state.dateList
);

export const getServiceCenterScheduledFilters = createSelector(
  getServiceCenterScheduledState,
  (state: fromServiceCenterScheduled.ServiceCenterScheduledState) =>
    state.filters
);

export const getServiceCenterScheduledStatuses = createSelector(
  getServiceCenterScheduledState,
  (state: fromServiceCenterScheduled.ServiceCenterScheduledState) =>
    state.statuses
);

export const getServiceCenterSlots = createSelector(
  getServiceCenterScheduledState,
  (state: fromServiceCenterScheduled.ServiceCenterScheduledState) =>
    state.slots
);



export const serviceCenterScheduledQuery = {
  getServiceCenterScheduledUuids,
  getServiceCenterScheduledEntities,
  getAllServiceCenterScheduled,
  getSelectedServiceCenterScheduled,
  getServiceCenterScheduledTotal,
  getServiceCenterScheduledTotals,
  getServiceCenterScheduledLoaded,
  getServiceCenterScheduledLoading,
  getServiceCenterScheduledError,
  getServiceCenterScheduledDayList,
  getAllServicecenterScheduledReports,
  getServiceCenterCalendarEntities,
  getServiceCenterCalendarAll,
  getServiceCenterScheduledFilters,
  getServiceCenterScheduledStatuses,
  getServiceCenterSlots
};
