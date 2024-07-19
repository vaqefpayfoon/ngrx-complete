import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCalendars from './calendars.reducer';

export interface ICalendarState {
  readonly calendars: fromCalendars.CalendarsState;
}

export const REDUCERS: ActionReducerMap<ICalendarState> = {
  calendars: fromCalendars.reducer,
};

export const getCalendarsModuleState = createFeatureSelector<ICalendarState>(
  'manual-calendars'
);
