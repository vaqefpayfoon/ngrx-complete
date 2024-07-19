import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromCalendars from '../reducers/calendars.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { ICalendars } from '../../models';

export const getCalendarsState = createSelector(
  fromFeature.getCalendarsModuleState,
  (state: fromFeature.ICalendarState) => state.calendars
);

export const getCalendarsEntities = createSelector(
  getCalendarsState,
  fromCalendars.selectCalendarsEntities
);

export const getCalendarsUuids = createSelector(
  getCalendarsState,
  fromCalendars.selectCalendarsUuids
);

export const getAllCalendars = createSelector(
  getCalendarsState,
  fromCalendars.selectAllCalendars
);

export const getCalendarsTotals = createSelector(
  getCalendarsState,
  fromCalendars.selectCalendarsTotal
);

export const getCalendarsTotal = createSelector(
  getCalendarsState,
  (state: fromCalendars.CalendarsState) => state.total
);

export const getCalendarsFilter = createSelector(
  getCalendarsState,
  (state: fromCalendars.CalendarsState) => state.filter
);

export const getSelectedCalendar = createSelector(
  getCalendarsEntities,
  fromRoot.getRouterState,
  (entities, router): ICalendars.IDocument =>
    entities ? router.state && entities[router.state.params.uuid] : null
);

export const getCalendarsLoaded = createSelector(
  getCalendarsState,
  (state: fromCalendars.CalendarsState) => state.loaded
);

export const getCalendarsLoading = createSelector(
  getCalendarsState,
  (state: fromCalendars.CalendarsState) => state.loading
);

export const getCalendarsError = createSelector(
  getCalendarsState,
  (state: fromCalendars.CalendarsState) => state.error
);

export const getSelectedDate = createSelector(
  getCalendarsState,
  (state: fromCalendars.CalendarsState) => state.selectedDate
);

export const CalendarsQuery = {
  getCalendarsState,
  getCalendarsEntities,
  getCalendarsUuids,
  getAllCalendars,
  getCalendarsTotals,
  getCalendarsTotal,
  getCalendarsFilter,
  getSelectedCalendar,
  getCalendarsLoaded,
  getCalendarsLoading,
  getCalendarsError,
  getSelectedDate
};
