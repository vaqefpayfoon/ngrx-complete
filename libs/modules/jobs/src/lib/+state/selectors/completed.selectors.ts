import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducer';
import * as fromCompleted from '../reducer/completed.reducer';

import { ICalendar } from '../../models';

export function sortByDate(
  a: ICalendar.IDocument,
  b: ICalendar.IDocument
): number {
  return a.day.localeCompare(b.day);
}

export const getCompletedState = createSelector(
  fromFeature.getReservationsState,
  (state: fromFeature.IReservationsState) => state.completed
);

export const getCompletedUuids = createSelector(
  getCompletedState,
  fromCompleted.selectCompletedUuids
);

export const getCompletedEntities = createSelector(
  getCompletedState,
  fromCompleted.selectCompletedEntities
);

export const getCalendarEntities = createSelector(
  getCompletedState,
  (state: fromCompleted.CompletedState) => state.calendar
);

export const getCalendarAll = createSelector(
  getCalendarEntities,
  entities =>
    entities ? Object.keys(entities).map(uuid => entities[uuid]).sort(sortByDate) : null
);

export const getAllCompleted = createSelector(
  getCompletedState,
  fromCompleted.selectAllCompleted
);

export const getAllReports = createSelector(
  getCompletedState,
  (state: fromCompleted.CompletedState) => state.reports
);

export const getSelectedMobileServiceScheduledReservation = createSelector(
  getCompletedState,
  (state: fromCompleted.CompletedState) => state.selectedCompleted
);

export const getCompletedTotals = createSelector(
  getCompletedState,
  fromCompleted.selectCompletedTotal
);

export const getCompletedLoaded = createSelector(
  getCompletedState,
  (state: fromCompleted.CompletedState) => state.loaded
);

export const getCompletedLoading = createSelector(
  getCompletedState,
  (state: fromCompleted.CompletedState) => state.loading
);

export const getCompletedError = createSelector(
  getCompletedState,
  (state: fromCompleted.CompletedState) => state.error
);

export const getCompletedDayList = createSelector(
  getCompletedState,
  (state: fromCompleted.CompletedState) => state.dateList
);

export const getMobileServiceScheduledFilters = createSelector(
  getCompletedState,
  (state: fromCompleted.CompletedState) => state.filters
);

export const getMobileServiceScheduledStatuses = createSelector(
  getCompletedState,
  (state: fromCompleted.CompletedState) => state.statuses
);

export const completedQuery = {
  getCompletedUuids,
  getCompletedEntities,
  getAllCompleted,
  getSelectedMobileServiceScheduledReservation,
  getCompletedTotals,
  getCompletedLoaded,
  getCompletedLoading,
  getCompletedError,
  getCompletedDayList,
  getAllReports,
  getCalendarEntities,
  getCalendarAll,
  getMobileServiceScheduledFilters,
  getMobileServiceScheduledStatuses
};
