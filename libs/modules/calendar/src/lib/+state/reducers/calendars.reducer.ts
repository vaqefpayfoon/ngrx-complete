import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { CalendarsActions } from '../actions';

import { ICalendars } from '../../models';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

export interface CalendarsState extends EntityState<ICalendars.IDocument> {
  total: number;
  selectedDate: _moment.Moment;
  filter: ICalendars.IGetCalendar;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<ICalendars.IDocument> = createEntityAdapter<
  ICalendars.IDocument
>({
  selectId: (calendar) => calendar.uuid,
});

export const initialState: CalendarsState = adapter.getInitialState({
  total: 0,
  selectedDate: null,
  filter: null,
  loaded: false,
  loading: false,
  error: null,
});

const calendarsReducer = createReducer(
  initialState,

  on(CalendarsActions.ResetCalendarsFilter, (_) => {
    return adapter.removeAll({
      ...initialState,
      filter: {
        selectedTypes: null,
        year: moment().year(),
        month: moment().month() + 1,
      },
      selectedDate: moment(),
    });
  }),

  on(CalendarsActions.SetCalendarsFilter, (_, { payload }) => {
    const filter = payload;
    return adapter.removeAll({
      ...initialState,
      filter,
      selectedDate: moment(),
    });
  }),

  on(CalendarsActions.ChangeCalendarsFilter, (state, { payload }) => {
    const filter = {
      ...state.filter,
      ...payload,
    };
    return {
      ...state,
      filter,
    };
  }),

  on(CalendarsActions.LoadCalendars, (state) => {
    return {
      ...state,
      loading: true,
    };
  }),

  on(CalendarsActions.SelectCurrentDate, (state, { payload }) => {
    const selectedDate = payload;
    return {
      ...state,
      selectedDate,
    };
  }),

  on(CalendarsActions.LoadCalendarsSuccess, (state, { payload }) => {
    return adapter.setAll(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
      total: payload.length,
    });
  }),

  on(
    CalendarsActions.UpdateCalendarSlotSuccess,
    CalendarsActions.UpdateCalendarSuccess,
    (state, { payload }) => {
      const { document } = payload;

      return adapter.updateOne(document, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(CalendarsActions.LoadCalendarsFail, (state, { payload }) => {
    const error = payload;

    return adapter.removeAll({
      ...state,
      loading: false,
      loaded: false,
      error,
      total: 0,
    });
  }),

  on(
    CalendarsActions.UpdateCalendarSlotFail,
    CalendarsActions.UpdateCalendarFail,
    (state, { payload }) => {
      const error = payload;

      return {
        ...state,
        error,
      };
    }
  ),

  on(
    CalendarsActions.UpdateDay,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  )
);

export function reducer(
  state: CalendarsState | undefined,
  action: CalendarsActions.CalendarsActionsUnion
) {
  return calendarsReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Calendars uuids
export const selectCalendarsUuids = selectIds;

// select the dictionary of Calendars entities
export const selectCalendarsEntities = selectEntities;

// select the array of Calendars
export const selectAllCalendars = selectAll;

// select the total Calendars count
export const selectCalendarsTotal = selectTotal;
